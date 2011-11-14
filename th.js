String.prototype.format = function () {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

var keys = {};
var keyHandler = function(event) {
   var char = String.fromCharCode(event.which);
   if (!char.match(/[A-Za-z0-9]/)) return;
   if (!keys[char]) keys[char] = 0;
   keys[char]++;
   //console.log(char, keys[char]);
   var $tr = $('#'+char);
   if ($tr.length === 0) {
      //console.log('new row');
      var row = '<tr id="{0}"><td>{0}</td><td class="counter">{1}</td></tr>';
      $('#results > tbody:last').append(row.format(char,keys[char]));
   }
   $tr.children('.counter').text(keys[char]);
   sort();
};

var sort = function() {
   var l = $('#results').find('tr').detach();
   l = l.sort(function(a,b) {
      if ( keys[a.id] == keys[b.id] ) return 0;
      return keys[a.id] < keys[b.id] ? 1 : -1;
   });
   $('#results').append(l);
};

$(document).ready(function() {
   $(document).keypress(keyHandler);
});
