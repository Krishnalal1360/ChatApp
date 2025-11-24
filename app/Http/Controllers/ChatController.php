<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    //
    public function index(){
        //
        $usersExceptAuthUser = User::where('id', '!=', Auth::id())->get();
        return view('dashboard', compact('usersExceptAuthUser'));
    }
    //
    public function fetchMessages(Request $request){
        //
        dd($request->all());
    }
}
