const baseUrl = $('meta[name="base-url"]').attr('content');
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
    //
    e.preventDefault();
    $(".blank-wrap").addClass("d-none");
    let userId = $(this).data("id");
    metaId.setAttribute("content", userId);
    fetchMessage();
});

$(document).on("submit", ".message-form", function(e){
    e.preventDefault();
    sendMessage();
});

const userId = metaId.getAttribute("content");
Window.Echo.private('UserChannelID-' + userId)
           .listen('SendMessageEvent', (e) => {
                inbox.append(appendMessage(e.message, "sent"));
           });