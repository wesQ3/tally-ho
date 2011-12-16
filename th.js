var keys = {}, per;
var makeRow = 
   _.template('<tr id="<%= char %>"><td><%= char %></td><td class="counter"><%= val %></td><td><%= per %></td></tr>');

var keyHandler = function(event) {
   var char = String.fromCharCode(event.which);
   if (!char.match(/[A-Za-z0-9]/)) return;
   if (!keys[char]) { keys[char] = { count: 0, alias: char } };
   keys[char].count++;

   var total = _(keys).chain().values()
      .map(function(o) { return o.count })
      .reduce(function(a,b) { return a + b }).value();
   var rows = _(keys).chain().keys()
      .sortBy(function(char) { return -keys[char].count })
      .map(function(char) { return makeRow(
         { char: keys[char].alias, val: keys[char].count, 
            per: ( 100*( keys[char].count )/total ).toFixed(2) 
         })})
      .value().join('');

   var total_row = makeRow({ char: 'Total', val: total });

   $('#results > tbody').empty().append(rows + total_row);
};

var resetKeys = function() {
   keys = {}; 
   $('#results > tbody').empty()
      .append('<tr><td>Start typing keys to begin tallying...</td></tr>');
};

$(document).ready(function() {
   $(document).keypress(keyHandler);
   $('#reset').click(resetKeys);
});
