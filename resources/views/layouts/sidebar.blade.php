<div id="sidepanel">
            <div id="profile">
                <div class="wrap">
                    <img id="profile-img" src="{{ asset('uploads/avatar.png') }}" class="online" alt="" />
                    <p>{{ auth()->user()->name }}</p>
                    <i class="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                    <div id="status-options">
                        <ul>
                            <li id="status-online" class="active"><span class="status-circle"></span>
                                <p>Online</p>
                            </li>
                            <li id="status-away"><span class="status-circle"></span>
                                <p>Away</p>
                            </li>
                            <li id="status-busy"><span class="status-circle"></span>
                                <p>Busy</p>
                            </li>
                            <li id="status-offline"><span class="status-circle"></span>
                                <p>Offline</p>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
               <hr> 
            <div id="contacts">
            <ul>
                @forelse ($usersExceptAuthUser as $user)
                    <li class="contact-id" data-id="{{ $user->id }}">
                    <div class="wrap">
                
                        <div class="avatar">
                            <img src="{{ asset('uploads/avatar.png') }}" alt="" />
                            <span class="contact-status offline"></span>
                        </div>

                        <div class="meta">
                            <p class="name">{{ $user->name }}</p>
                            <p class="preview">{{ $user->email }}</p>
                        </div>
                    </div>
                    </li>
                @empty
                    <p class="text-center">No users found.</p>
                @endforelse
            </ul>
            </div>


            <div class="text-center mt-3 mb-3">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="btn btn-danger btn-sm mb-3">
                        Logout
                    </button>
                </form>
            </div>
          
        </div>