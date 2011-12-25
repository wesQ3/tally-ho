var keys = {}, per;
var makeRow = 
   _.template('<tr id="<%= key %>"><td class="key"><%= key %></td><td class="alias"><%= char %></td>\
      <td class="counter"><%= val %></td><td><%= per %></td></tr>');
var makeTotalRow = 
   _.template('<tr id="total"><td></td><td>Total</td><td class="counter"><%= val %></td><td>100</td></tr>');

var keyHandler = function(event) {
   var char = String.fromCharCode(event.which);
   if (!char.match(/[A-Za-z0-9]/)) return;
   if (!keys[char]) { keys[char] = { count: 0, alias: char } };
   keys[char].count++;
   refreshTable();
};

var refreshTable = function () {
   if (_(keys).keys().length == 0) return;
   var total = _(keys).chain().values()
      .map(function(o) { return o.count })
      .reduce(function(a,b) { return a + b }).value();
   var rows = _(keys).chain().keys()
      .sortBy(function(char) { return -keys[char].count })
      .map(function(char) {
         var percent = ( 100*( keys[char].count )/total ).toFixed(2);
         return makeRow({
            key: char, char: keys[char].alias,
            val: keys[char].count,
            per: isNaN( percent ) ? '?' : percent
         })
      })
      .value().join('');

   var totalRow = makeTotalRow({ val: total });

   $('#results > tbody').empty().append(rows + totalRow);
};

var renameKeys = function() {
   if (_(keys).keys().length == 0) return;
   $(document).off('keypress');
   $('td.alias').each(function() {
      var text = $(this).text();
      $(this).empty().append("<input value='" + text + "'></input>");
   });
   $('td.alias > input:first').focus().select();
   $('#rename').text('Done Renaming').off('click').click(stopRename);
};

var stopRename = function() {
   $('td.alias > :input').each(function() {
      var text = $(this).val();
      keys[$(this).parents('tr').attr('id')].alias = text; 
   });

   var freeze = {};
   _(keys).each(function(val,key) {freeze[key] = val.alias;})
   localStorage.keys = JSON.stringify(freeze);

   refreshTable();
   $('#rename').text('Rename Tallies').off('click').click(renameKeys);
   $(document).keypress(keyHandler);
};

var resetCounts = function() { _(keys).each(function(key) { key.count = 0; }); };

var clearStorage = function() {
   delete localStorage.keys;
   keys = {}; 
   $('#results > tbody').empty()
      .append('<tr><td>Start typing keys to begin tallying...</td></tr>');
};

$(document).ready(function() {
   $(document).keypress(keyHandler);
   $('#reset').click(function() { resetCounts(); refreshTable(); });
   $('#rename').click(renameKeys);
   $('#clear').click(clearStorage);
   if (localStorage.keys) {
      var thaw = JSON.parse(localStorage.keys);
      _(thaw).each(function(val,key) { keys[key] = { alias: val, count: 0 }; });
      refreshTable();
   }
});
