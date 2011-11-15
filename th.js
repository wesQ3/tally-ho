var keys = {}, per;
var makeRow = 
   _.template('<tr id="<%= char %>"><td><%= char %></td><td class="counter"><%= val %></td><td><%= per %></td></tr>');
var keyHandler = function(event) {
   var char = String.fromCharCode(event.which);
   if (!char.match(/[A-Za-z0-9]/)) return;
   if (!keys[char]) keys[char] = 0;
   keys[char]++;

   $('#results > tbody').empty();
   var total = _(keys).chain().values().reduce(function(a,b) { return a + b }).value();
   var rows = _(keys).chain().keys()
      .sortBy(function(char) { return -keys[char] })
      .map(function(char) { return makeRow(
         { char: char, val: keys[char], per: ( 100*keys[char]/total ).toFixed(2) })})
      .value().join('');

   var total_row = makeRow({ char: 'Total', val: total });

   $('#results > tbody').append(rows + total_row);
};

$(document).ready(function() {
   $(document).keypress(keyHandler);
   $('#reset').click(function() {
      keys = {}; 
      $('#results > tbody').empty()
         .append('<tr><td>Start typing keys to begin tallying...</td></tr>');
   });
});
