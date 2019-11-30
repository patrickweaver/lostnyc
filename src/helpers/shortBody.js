module.exports = function(item) {
  item.shortBody = '';
  if (item.body.length > 240) {
    item.shortBody = item.body.substr(0, 239) + '... ';
  } else {
    item.shortBody = item.body;
  }
  return item;
}