var keys = {};
var makeRow = 
   _.template('<tr id="<%= char %>"><td><%= char %></td><td class="counter"><%= val %></td></tr>');
var keyHandler = function(event) {
   var char = String.fromCharCode(event.which);
   if (!char.match(/[A-Za-z0-9]/)) return;
   if (!keys[char]) keys[char] = 0;
   keys[char]++;

   $('#results > tbody').empty();
   var rows = _(keys).chain().keys()
      .sortBy(function(char) { return -keys[char] })
      .map(function(char) { return makeRow({ char: char, val: keys[char] })})
      .value().join('');

   $('#results > tbody').append(rows);
};

$(document).ready(function() {
   $(document).keypress(keyHandler);
});
