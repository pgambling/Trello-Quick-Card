Trello.authorize({
  interactive: false
});

var boardId = localStorage['board'];
var listId = localStorage['list'];

function submit() {
  var $successMsg = $('#successMsg').hide();
  var $cardText = $('#cardText');

  Trello.post('cards', {
    name: $cardText.val(),
    idList: listId
  })
  .done(function (newCard) {
    $cardText.val('');
    $successMsg
    .show()
    .children('a')
    .attr('href', newCard.url);
  });
};

$(function () {
  if(!boardId || !listId || !Trello.authorized()) {
    $(document.body).html('Please configure the extensions before use.');
    window.open("options.html");
    return;
  }
  var $submit = $('#submit');
  $submit.click(submit);
  $('#cardText').keyup(function(e) {
    if (e.which === 13) {
      $submit.click(); 
    }
  });
});