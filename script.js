$(function () {
    var socket = io();

    $('#send').click(function () {
        sendMessage();
    });

    $('#input').keypress(function (e) {
        if (e.which === 13) {
            sendMessage();
        }
    });

    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });

    function sendMessage() {
        var message = $('#input').val();
        if (message.trim() !== '') {
            socket.emit('chat message', message);
            $('#input').val('');
        }
    }
});
