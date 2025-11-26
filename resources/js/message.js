/*const baseUrl = $('meta[name="base-url"]').attr('content');
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
const metaId  = document.querySelector('meta[name="meta-contact-id"]');
const inbox = $(".messages ul");   

function fetchMessage(){
    let userId = metaId.getAttribute("content");
    $.ajax({
        type: "GET",
        url: `${baseUrl}/fetch-messages`,
        data: {
            _token: csrfToken,
            contact_id: userId
        },
        beforeSend: function(){
            toggleLoader();
        },
        success: function(data){
            setContact(data.user);
            inbox.empty();
            data.messages.forEach(value => {
                if(value.sender_id == userId){
                    inbox.append(appendMessage(value.message, "sent"));
                }else{
                    inbox.append(appendMessage(value.message, "replies"));
                }
            });
        },
        error: function(xhr){
        },
        complete: function(){
            toggleLoader();
        }
    });
}

function setContact(user){
    $(".contact-name").text(user.name);
}

function toggleLoader(){
    $(".loader").toggleClass("d-none");
}

function sendMessage(){
    let userId = metaId.getAttribute("content");  
    let userFormData = $(".message-form").serialize();
    let messageBox = $(".message-box"); 
    //let inbox = $(".messages ul");   
    let message = messageBox.val().trim();
    $.ajax({
        method: "POST",
        url: `${baseUrl}/send-message`,
        data: userFormData + `&contact_id=${userId}`,
        beforeSend: function(){
            inbox.append(appendMessage(message, "replies"));
            messageBox.val("");
        },
        success: function(data){
        },
        error: function(xhr){
            console.error(xhr.responseText);
        }
    });
}

function appendMessage(text, type){
    return `<li class="${type}">
                <img src="${baseUrl}/uploads/avatar.png" alt="" />
                <p>${text}</p>
            </li>`;
}

$(document).on("click", ".contact-id", function(e){
    e.preventDefault();
    $(".blank-wrap").addClass("d-none");

    let userId = $(this).data("id");
    metaId.setAttribute("content", userId);

    window.Echo.private(`UserChannelID-${userId}`)
    .listen('SendMessageEvent', (e) => {
        if (e.sender_id == userId) {
            inbox.append(appendMessage(e.message, "sent"));
        }
    });

    fetchMessage();
});

$(document).on("submit", ".message-form", function(e){
    e.preventDefault();
    sendMessage();
});*/

//

const baseUrl = $('meta[name="base-url"]').attr('content');
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
const metaId  = document.querySelector('meta[name="meta-contact-id"]');
const inbox = $(".messages ul");
let chatChannel = null; // 👈 IMPORTANT

function fetchMessage(){
    let userId = metaId.getAttribute("content");
    $.ajax({
        type: "GET",
        url: `${baseUrl}/fetch-messages`,
        data: {
            _token: csrfToken,
            contact_id: userId
        },
        beforeSend: toggleLoader,
        success: function(data){
            setContact(data.user);
            inbox.empty();
            data.messages.forEach(value => {
                inbox.append(
                    appendMessage(
                        value.message, 
                        value.receiver_id == userId ? "replies" : "sent"
                    )
                );
            });
            scrollToBottom();
        },
        complete: toggleLoader
    });
}

function setContact(user){
    $(".contact-name").text(user.name);
}

function toggleLoader(){
    $(".loader").toggleClass("d-none");
}

function sendMessage(){
    let userId = metaId.getAttribute("content");
    let messageBox = $(".message-box");
    let message = messageBox.val().trim();

    $.ajax({
        method: "POST",
        url: `${baseUrl}/send-message`,
        data: $(".message-form").serialize() + `&contact_id=${userId}`,
        beforeSend: function(){
            inbox.append(appendMessage(message, "replies")); // 👈 FIXED
            messageBox.val("");
        },
        success: function(){
            scrollToBottom();
        }
    });
}

function appendMessage(text, type){
    return `<li class="${type}">
                <img src="${baseUrl}/uploads/avatar.png" alt="" />
                <p>${text}</p>
            </li>`;
}

function scrollToBottom(){
    //
    $('.messages').stop().animate({
        scrollTop: $('.messages')[0].scrollHeight
    });
}

// 🔥 Real socket subscription (Correct)
$(document).on("click", ".contact-id", function(e){
    e.preventDefault();
    $(".blank-wrap").addClass("d-none");

    let oldId = metaId.getAttribute("content");
    let newId = $(this).data("id");

    metaId.setAttribute("content", newId);

    // Leave old channel
    if(chatChannel && oldId){
        chatChannel.stopListening('SendMessageEvent');
        Echo.leave(`private-UserChannelID-${oldId}`);
    }

    // Subscribe to new channel
    chatChannel = window.Echo.private(`UserChannelID-${newId}`)
    .listen('SendMessageEvent', (e) => {
        // Show message only if message came from other user
        if (e.sender_id != newId) {
            inbox.append(appendMessage(e.message, "replies"));
            scrollToBottom();
        }
    });

    fetchMessage();
});

$(document).on("submit", ".message-form", function(e){
    e.preventDefault();
    sendMessage();
});

window.Echo.join('OnlineChannel')
    .here((users) => {  
        users.forEach((user)=>{
            let element = $(`.contact-id[data-id="${user.id}"]`);
            if(element.length > 0){
                element.find('.contact-status').removeClass('offline').addClass('online');
            }else{
                element.find('.contact-status').removeClass('online').addClass('offline');
            }
        });
    })
    .joining((user) => {
        let element = $(`.contact-id[data-id="${user.id}"]`);
        if(element.length > 0){
            element.find('.contact-status').removeClass('offline').addClass('online');
        }
    })
    .leaving((user) => {
        let element = $(`.contact-id[data-id="${user.id}"]`);
        if(element.length > 0){
            element.find('.contact-status').removeClass('online').addClass('offline');
        }
    }); 