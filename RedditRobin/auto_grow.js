
// Auto grow checkbox
chrome.storage.local.get('grow', function(items){
  // make the input box
  if (items.grow) {
    var checkbox = '<label><input type="checkbox" id="auto_grow" checked>Automatically grow</label>';
  } else {
    var checkbox = '<label><input type="checkbox" id="auto_grow">Automatically grow</label>';
  }
  // inject the checkbox
  var notifier = document.getElementById('robinDesktopNotifier')
  notifier.innerHTML = notifier.innerHTML + checkbox;
  // add an onclick to save the preference. And vote immediately.
  document.getElementById('auto_grow').onclick = function(){
    if (this.checked){
      chrome.storage.local.set({'grow':true});
      say('/vote grow');
    } else {
      chrome.storage.local.set({'grow':false});
    }
  }
});


// When the page is done loading, check if we need to auto grow.
function auto_grow(){
  chrome.storage.local.get('grow', function(items){
    if (items.grow) { say('/vote grow'); }
  })
}

// Say the message and return the text box back to what it was.
function say(msg){
  var save = document.querySelector('#robinSendMessage input[type=text]').value;
  document.querySelector('#robinSendMessage input[type=text]').value = msg;
  document.querySelector('#robinSendMessage input[type=submit]').click();
  document.querySelector('#robinSendMessage input[type=text]').value = save;
}
/**
 * Borrowed from an older project that needed to make sure that the page was
 * really done. Chrome will report that it is done, but js can kickoff more
 * loading. So we check if the page is done loading every 200ms. If we see done
 * twice in a row, we consider it "done"
**/
last_was_done = false
function finish(){
  if(!document || document.readyState !='complete') {
    last_was_done = false
    window.clearTimeout(window.pageLoaderPid);
    window.pageLoaderPid = window.setTimeout( finish, 200 );
    return;
  } else if (!last_was_done) {
    last_was_done = true
    window.clearTimeout(window.pageLoaderPid);
    window.pageLoaderPid = window.setTimeout( finish, 200 );
    return;
  }
  window.setTimeout(auto_grow, 5000);
}
window.pageLoaderPid = window.setTimeout(finish, 2000);
