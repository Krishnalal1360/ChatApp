<x-app-layout>
        <div id="frame">
        @include('layouts.sidebar')
        <div class="content">
            <div class="blank-wrap">
                <div class="inner-blank-wrap">
                    Select a user to start chatting.
                </div>
            </div>
            <div class="loader d-none">
                <div class="inner-loader">
                    <l-helix>
                        size="45"
                        speed="0.001"
                        color="black" 
                    </l-helix>
                </div>
            </div>
            <div class="contact-profile">
                <img src="{{ asset('uploads/avatar.png') }}" alt="" />
                    <p class="contact-name"></p>
                    <div class="social-media">
                </div>
            </div>
            <div class="messages">
                <ul>
                    {{-- 
                    <x-message class="sent" text="Hello WhatsApp!"/>
                    <x-message class="replies" text="Hi! How can I help you?"/>
                    --}}
                </ul>
            </div>
            <div class="message-input">
                <form method="POST" action="{{ route('send-message') }}" class="message-form">
                    @csrf
                    <div class="wrap">
                        <input type="text" name="message" class="message-box" autocomplete="off" placeholder="Write your message..." />
                        <button type="submit" class="submit">
                            <i class="fa fa-paper-plane" aria-hidden="true"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <x-slot name="scripts">
        @vite(['resources/css/app.css',
        'resources/js/app.js',
        'resources/js/message.js'])
    </x-slot>
</x-app-layout>