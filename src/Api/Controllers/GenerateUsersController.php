<?php

namespace Imynely\GenerateUsers\Api\Controllers;

use Flarum\Http\RequestUtil;
use Flarum\User\User;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Illuminate\Support\Str;
use Flarum\Foundation\Paths;
use Carbon\Carbon;


class GenerateUsersController implements RequestHandlerInterface
{
    private $paths;
    private $avatars;

    public function __construct(Paths $paths)
    {
        $this->paths = $paths;
        $this->avatars = $this->loadAvatars();
    }

    public function handle(ServerRequestInterface $request): JsonResponse
    {
        $actor = RequestUtil::getActor($request);

        if (!$actor->isAdmin()) {
            return new JsonResponse(['error' => 'Permission denied'], 403);
        }

        $count = json_decode($request->getBody())->count ?? 1;
        $nickNames = $this->randomNickNames($count);

        $users = $this->generateUsers($count, $nickNames);

        return new JsonResponse(['users' => $users]);
    }

    private function generateUsers(int $count, array $nickNames): array
    {
        $users = [];
        $now = Carbon::now();
        $twoMonthsAgo = $now->copy()->subMonths(2);

        for ($i = 0; $i < $count; $i++) {
            $username = str_replace(' ', '', $nickNames[$i]);
            $email = bin2hex(random_bytes(8)) . '@mail.ru';
            $joinedAt = Carbon::createFromTimestamp(rand($twoMonthsAgo->timestamp, $now->subMonth()->timestamp));

            $user = [
                'username' => $username,
                'email' => $email,
                'password' => Str::random(12),
                'avatar_url' => $this->randomAvatar(),
                'joined_at' => $joinedAt->format('Y-m-d H:i:s'),
                'last_seen_at' => $now->copy()->subMinutes(rand(5, 15)) ->format('Y-m-d H:i:s'),
                'is_email_confirmed' => 1
            ];

            $users[] = $user;
        }

        $this->bulkInsertUsers($users);

        return $users;
    }

    private function bulkInsertUsers(array $users): void
    {
        $chunks = array_chunk($users, 100);
        foreach ($chunks as $chunk) {
            User::query()->upsert($chunk, ['username'], ['username', 'email', 'password', 'avatar_url', 'joined_at', 'last_seen_at', 'is_email_confirmed']);
        }
    }

    private function loadAvatars(): array
    {
        $dir = $this->paths->public . "/assets/avatars/";
        $avatars = glob($dir . "*.{jpg,gif,png}", GLOB_BRACE);
        return array_map('basename', $avatars);
    }

    private function randomAvatar(): string
    {

        $avatar = $this->avatars[array_rand($this->avatars)];
        return $avatar;
    }

    private function randomNickNames(int $count): array
    {
        $file = $this->paths->storage . '/app/nicknames.txt';
        if (!file_exists($file)) {
            throw new \Exception("The file with nicknames was not found.");
        }

        $nicknames = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (empty($nicknames)) {
            throw new \Exception("The list of nicknames is empty.");
        }

        shuffle($nicknames);
        return array_slice($nicknames, 0, min($count, count($nicknames)));
    }

}
