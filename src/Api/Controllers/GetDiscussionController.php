<?php

namespace Imynely\GenerateUsers\Api\Controllers;

use Flarum\Http\RequestUtil;
use Flarum\Discussion\Discussion;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Illuminate\Support\Str;
use Flarum\Foundation\Paths;
use Carbon\Carbon;


class GetDiscussionController implements RequestHandlerInterface
{


    public function handle(ServerRequestInterface $request): JsonResponse
    {
        $actor = RequestUtil::getActor($request);

        if (!$actor->isAdmin()) {
            return new JsonResponse(['error' => 'Permission denied'], 403);
        }

        $discussions = Discussion::query()->select('id', 'title', 'user_id')->get();

        return new JsonResponse($discussions);
    }
}
