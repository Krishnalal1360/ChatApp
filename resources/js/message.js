const baseUrl = $('meta[name="base-url"]').attr('content');
const metaId  = document.querySelector("meta[name='contact-id']");

function fetchMessages(){
    let userId = metaId.getAttribute("content");

    $.ajax({
        type: "GET",
        url: `${baseUrl}/fetch-messages`,
        data: {
            _token: $('meta[name="csrf-token"]').attr('content'),
            contact_id: userId
        },
        beforeSend: function(){
            console.log("Fetching chat with:", userId);
        },
        success: function(response){
            console.log("Messages:", response);
        },
        error: function(xhr){
            console.error("Fetch Error:", xhr.responseText);
        }
    });
}

$(document).on("click", ".contact-id", function(){
    let userId = $(this).data("id");
    metaId.setAttribute("content", userId);
    fetchMessages();
});
