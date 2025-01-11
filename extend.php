<?php

/*
 * This file is part of imynely/generate-users.
 *
 * Copyright (c) 2024 Imynely.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Imynely\GenerateUsers;

use Imynely\GenerateUsers\Api\Controllers\GenerateUsersController;
use Imynely\GenerateUsers\Api\Controllers\GetDiscussionController;
use Imynely\GenerateUsers\Api\Controllers\GeneratePostsController;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),
    new Extend\Locales(__DIR__.'/locale'),
    (new Extend\Routes('api'))
        ->post('/generate-users', 'generate-users', GenerateUsersController::class)
        ->get('/getDiscussion', 'getDiscussion', GetDiscussionController::class)
        ->post('/generatePosts', 'generatePosts', GeneratePostsController::class),
];
