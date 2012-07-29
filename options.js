Trello.authorize({
  interactive: false
});

function authorize() {
   Trello.authorize({
      type: 'redirect',
      persist: true,
      success: updateLoginStatus,
      error: function () { console.log('authorize failed!'); },
      expiration: 'never',
      scope: { write: true, read: true }
  });
}

// Saves options to localStorage.
function saveOptions() {
  localStorage['board'] = $('#board').val();
  localStorage['list'] = $('#list').val();

  // Update status to let user know options were saved.
  $('#status')
  .html('Options Saved.')
  .fadeOut(750)
  .html('');
}

// Restores options state from localStorage
function restoreOptions() {
  for(var index in optionNames) {
    var option = optionNames[index];
    var value = localStorage[option];
    if(value) {
      $('#' + option).val(localStorage[option]);
    }
  }
}

function setUserName() {
  Trello.members.get('me').done(function (member) {
    $('#userName').html(member.fullName);
  });  
}

function addOption(value, text, $select) {
  $('<option></option>')
      .attr('value', value)
      .text(text)
      .appendTo($select);
}

function loadAvailableBoards() {
  Trello.members.get('me/boards').done(function (boards) {
    var $boardSelect = $('#board');
    boards.forEach(function (board) { 
      addOption(board.id, board.name, $boardSelect);
    });
    var selectedBoard = localStorage['board'];
    if(selectedBoard) {
      $boardSelect.val(selectedBoard);
    }
    loadAvailableLists();
  });
}

function logout() { 
  Trello.deauthorize(); 
  updateLoginStatus();
}

function updateLoginStatus() {
  var isLoggedIn = Trello.authorized();
  $("#loggedOut").toggle(!isLoggedIn);
  $("#loggedIn").toggle(isLoggedIn);

  if(isLoggedIn) {
    setUserName();
    loadAvailableBoards();
  }
}

function loadAvailableLists() {
  var selectedBoardId = $('#board').val();
  Trello.boards.get(selectedBoardId + '/lists').done(function (lists) {
    var $list = $('#list').empty();
    lists.forEach(function (list) {
      addOption(list.id, list.name, $list);
    });
  });
}

$(function () {
  updateLoginStatus();
  $('#save').click(saveOptions);
  $('#loggedOut a').click(authorize);  
  $('#logout').click(logout);
  $('#board').change(loadAvailableLists);
});