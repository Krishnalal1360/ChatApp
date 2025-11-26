<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('UserChannelID-{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('OnlineChannel', function ($user) {
    return $user->toArray();
});