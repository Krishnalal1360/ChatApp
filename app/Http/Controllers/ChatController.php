<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use App\Events\SendMessageEvent;

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
        //dd($request->all());
        $user = User::findOrFail($request->contact_id);
        $messages = Message::where(function($query) use($request){
                    $query->where('sender_id', Auth::id())->where('receiver_id', $request->contact_id);
                    })->orWhere(function($query) use($request){
                        $query->where('sender_id', $request->contact_id)->where('receiver_id', Auth::id());
                    })->get();
        return response()->json([
            'user' => $user,
            'messages' => $messages
        ]);
    }
    //
    public function sendMessage(Request $request){
        //
        //dd($request->all());
        $request->validate([
            "contact_id" => ["required"],
            "message" => ["required", "string"]
        ]);
        //
        $message = new Message();
        $message->sender_id = Auth::id();
        $message->receiver_id = $request->contact_id;
        $message->message = $request->message;
        $message->save();
        //
        event(new SendMessageEvent(Auth::id(), $request->contact_id, $request->message));
        //
        return response($message);
    }
}
