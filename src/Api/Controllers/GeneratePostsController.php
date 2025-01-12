<?php

namespace Imynely\GenerateUsers\Api\Controllers;

use Flarum\Http\RequestUtil;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\User\User;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Illuminate\Support\Str;
use Flarum\Foundation\Paths;
use Carbon\Carbon;


class GeneratePostsController implements RequestHandlerInterface
{

    private $paths;

    public function __construct(Paths $paths)
    {
        $this->paths = $paths;
    }

    public function handle(ServerRequestInterface $request): JsonResponse
    {
        $actor = RequestUtil::getActor($request);

        if (!$actor->isAdmin()) {
            return new JsonResponse(['error' => 'Permission denied'], 403);
        }

        $discussion_id = json_decode($request->getBody())->discussion_id;
        $count = json_decode($request->getBody())->count;

        $randomReviews = $this->randomReviews($count);


        $posts = $this->generateReviews($count, $discussion_id, $randomReviews);

        $lastPostId = Post::query()->where('discussion_id', $discussion_id)->orderBy('id', 'desc')->limit(1)->value('id');
        $postCount = Post::query()->where('discussion_id', $discussion_id)->count();

        Discussion::query()->where('id', $discussion_id)->update(
            [
                'comment_count' => $postCount,
                'last_post_id' => $lastPostId
            ]
        );

        return new JsonResponse(['posts' => $posts]);
    }

    private function generateReviews(int $count, int $discussion_id, array $Reviews): array
    {
        $posts = [];

        $startTime = Carbon::parse(Discussion::query()->where('id', $discussion_id)->orderBy('id', 'desc')->limit(1)->value('created_at'));

        if (Post::query()->where('discussion_id', $discussion_id)->exists()) {
            $startTime = Carbon::parse(Post::query()->where('discussion_id', $discussion_id)->orderBy('id', 'desc')->limit(1)->value('created_at'));
        }

        $author_id = Discussion::query()->where('id', $discussion_id)->first()->value('user_id');

        $fake_IP = rand(0, 255) . '.' . rand(0, 255) . '.' . rand(0, 255) . '.' . rand(0, 255);

        $users = User::query()
        ->whereNotIn('id', [1, $author_id])
        ->inRandomOrder()
        ->take($count)
        ->pluck('id')
        ->toArray();

        $number_for_sort = Post::query()
        ->where('discussion_id', $discussion_id)
        ->orderByDesc('number')
        ->limit(1)->value('number');

        $previosTime = $startTime;

        for ($i = 0; $i < $count; $i++) {

            ++$number_for_sort;

            $reviewText = '<t><p>' . $Reviews[$i] . '</p></t>'; // тут в теги оберунть для отображения

            $randomMinutes=rand(1, 43);
            $newTime=$previosTime->copy()->addMinutes($randomMinutes);


            $post = [
                'number' => $number_for_sort,
                'discussion_id' => $discussion_id,
                'created_at' => $newTime,
                'user_id' => $users[$i], // Рандом с таблицы юзерс, но не админ и не автор поста
                'type' => 'comment',
                'content' => $reviewText,
                'ip_address' => $fake_IP,
            ];

            $previosTime = $newTime;

            $posts[] = $post;
        }

        $this->bulkInsertPosts($posts);

        return $posts;
    }

    private function bulkInsertPosts(array $posts): void
    {
        $chunks = array_chunk($posts, 100);
        foreach ($chunks as $chunk) {
            Post::query()->insert($chunk);
        }
    }

    private function randomReviews(int $count): array
    {
        $file = $this->paths->storage . '/app/uniq_reviews.txt';
        if (!file_exists($file)) {
            throw new \Exception("The file with uniq reviews was not found.");
        }

        $reviews = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (empty($reviews)) {
            throw new \Exception("The list of uniq reviews is empty.");
        }

        shuffle($reviews);
        return array_slice($reviews, 0, min($count, count($reviews)));
    }
}
