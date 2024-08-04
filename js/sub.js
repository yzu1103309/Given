function sub()
{
    $.ajax({
        url: URL+"myBlog/sub.php",
        type: "POST",
        datatype: "html",
        data:{
            name: $("#name").val(),
            mail: $("#mail").val(),
            subject: $("#subject").val(),
            message: $("#message").val(),
        },
        success: function( output ) {
            alert("Successfully submitted your message");
        },
        error : function(){
           alert("submission failed");
        }
    });
}
