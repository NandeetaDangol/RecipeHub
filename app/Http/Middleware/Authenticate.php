<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Override redirectTo to return JSON instead of redirecting to login
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login'); // This is used only for web, not for API
        }

        // For API: return 401 JSON error instead of redirect
        abort(response()->json([
            'message' => 'Unauthenticated.'
        ], 401));
    }
}
