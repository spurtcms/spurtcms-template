document.querySelector("#centerSection").addEventListener("mouseup", () => {
  let selectionFromDocument = document.getSelection();
  let textValue = selectionFromDocument.toString();
  var hoverMenu = document.querySelector(".hoverMenu");
  var colorPicker = document.querySelector(".color-picker");
  var loggedflg = document.querySelector('.logged-flg');

  console.log(loggedflg.value);

  if (loggedflg.value=="true"){
    
    if (textValue == "") {
     
      hoverMenu.style.display = "none";
    
    } else {
      // Get the coordinates of the selected text
      let range = selectionFromDocument.getRangeAt(0);
      let rect = range.getBoundingClientRect();
  
      // Set the display style of the hoverMenu to block
      hoverMenu.style.display = "flex";
  
      // Calculate posX while keeping .color-picker within the viewport
      let posX = rect.left + window.scrollX + rect.width / 2;
      let colorPickerWidth = colorPicker.offsetWidth;
      let posXAdjusted = posX - 600;
  
      // Ensure that posXAdjusted is within the viewport
      if (posXAdjusted < 0) {
        posXAdjusted = 0;
      } else if (posXAdjusted + colorPickerWidth > window.innerWidth) {
        posXAdjusted = window.innerWidth - colorPickerWidth;
      }
  
      var divHeight = $('#centerSection');
  
      hoverMenu.style.left = posXAdjusted + "px";
      let posY = divHeight.scrollTop() + 25 + "px";
      hoverMenu.style.top = posY;
  
      // Set the position of the color-picker
      // console.log(posY);
      colorPicker.style.left = posXAdjusted + "px";
      colorPicker.style.top = posY;
    }
  }else{

    console.log("else--");
    hoverMenu.style.display = "none";

  }

 
});

/* HoverMenu */
var clientX, clientY;
document.addEventListener("mousedown", function (event) {
  clientX = event.pageX;
  clientY = event.pageY;
});

$(document).ready(function () {
  var Id = $("#spid").val()
  $('.tablinks[sp-id=' + Id + ']').addClass('active')
})

/* Search Input */
$("input[name='sname']").keyup(function () {
  $(".srch-arrow").addClass("div-show");
  $(".reset-inpt").attr("type", "reset");
  var searchTerm = $(this).val();
  $('.secton-content').removeHighlight();

  if (searchTerm) {
    $('.secton-content').highlight(searchTerm);
  }
  updateCount()
});

/* Search Input */
$(document).on('click', '.search-btn', function () {
  $("#search1").hide()
  $(".search2").show()
})

/* Search Cancel */
$(document).on('click', '.search-cnl', function () {
  $(".search2").hide()
  $("#search1").show()
  $('#search-data').val('')
  $(".srch-arrow").removeClass("div-show");
  $('.secton-content').removeHighlight();
})

/* Search Add Higlight */
jQuery.fn.highlight = function (pat) {
  function innerHighlight(node, pat) {
    var skip = 0;
    if (node.nodeType == 3) {
      var pos = node.data.toUpperCase().indexOf(pat);
      if (pos >= 0) {
        var spannode = document.createElement('span');
        spannode.className = 'highlight-content';
        var middlebit = node.splitText(pos);
        var endbit = middlebit.splitText(pat.length);
        var middleclone = middlebit.cloneNode(true);
        spannode.appendChild(middleclone);
        middlebit.parentNode.replaceChild(spannode, middlebit);
        skip = 1;
      }
    }
    else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
      for (var i = 0; i < node.childNodes.length; ++i) {
        i += innerHighlight(node.childNodes[i], pat);
      }
    }
    return skip;
  }
  return this.each(function () {
    innerHighlight(this, pat.toUpperCase());
  });
};

/* Search Remove Higlight */
jQuery.fn.removeHighlight = function () {
  function newNormalize(node) {
    for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {
      var child = children[i];
      if (child.nodeType == 1) {
        newNormalize(child);
        continue;
      }
      if (child.nodeType != 3) { continue; }
      var next = child.nextSibling;
      if (next == null || next.nodeType != 3) { continue; }
      var combined_text = child.nodeValue + next.nodeValue;
      new_node = node.ownerDocument.createTextNode(combined_text);
      node.insertBefore(new_node, child);
      node.removeChild(child);
      node.removeChild(next);
      i--;
      nodeCount--;
    }
  }

  return this.find("span.highlight-content").each(function () {
    var thisParent = this.parentNode;
    thisParent.replaceChild(this.firstChild, this);
    newNormalize(thisParent);
  }).end();
};

/* Search Count Update */
var count
var currentIndex = 0
function updateCount() {
  count = $(".highlight-content").length
  // console.log("co", count);
  $("#count").text((currentIndex + 1) + " of " + count);
  focusCurrentIndex();
}

/* Search Focus Index */
function focusCurrentIndex() {
  var highlightedWords = $(".highlight-content");

  if (count > 0) {
    highlightedWords.removeClass('focused');
    highlightedWords.css('background-color', '');

    var $currentElement = highlightedWords.eq(currentIndex);
    if (!isInViewport($currentElement)) {
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      var elementTop = $currentElement.offset().top;
      var targetScrollTop = elementTop - (windowHeight / 2);

      $('html, body').animate({ scrollTop: targetScrollTop }, 'smooth', function () {
        $currentElement.addClass('focused');
        $currentElement.css('background-color', '#ffa009');
      });
    } else {
      $currentElement.addClass('focused');
      $currentElement.css('background-color', '#ffa009');
    }
  }
}


function isInViewport(element) {
  var rect = element[0].getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/* Search Up-icon */
$("#up-icon").click(function () {
  if (count > 0) {
    currentIndex = (currentIndex - 1 + count) % count;
    updateCount();
  }
});

/* Search Down-icon */
$("#down-icon").click(function () {
  if (count > 0) {
    currentIndex = (currentIndex + 1) % count;
    updateCount();
  }
});

/* Notes and save */
$(document).on('click', '#save-btn', function () {
  var Pageid = $("#pgid").val();
  var text = $("#Textarea").val();
  if (text == "") {

    $.toast({
      text: "Please enter the notes", // Text that is to be shown in the toast
      heading: 'Warning', // Optional heading to be shown on the toast
      icon: 'warning', // Type of toast icon
      showHideTransition: 'fade', // fade, slide or plain
      allowToastClose: true, // Boolean value true or false
      hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
      stack: 2, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
      position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values



      textAlign: 'left',  // Text alignment i.e. left, right or center
      loader: true,  // Whether to show loader or not. True by default
      loaderBg: '#9EC600',  // Background color of the toast loader
      beforeShow: function () { }, // will be triggered before the toast is shown
      afterShown: function () { }, // will be triggered after the toat has been shown
      beforeHide: function () { }, // will be triggered before the toast gets hidden
      afterHidden: function () { }  // will be triggered after the toast has been hidden
    });

    return
  }

  $.ajax({
    type: "post",
    url: "/notes",
    dataType: 'json',
    data: {
      pgid: Pageid,
      content: text
    },
    success: function (result) {
      if (result.note.length > 0) {
        $("#mySidenavRgt>.note-content").empty()
        for (let j of result.note) {
          $("#mySidenavRgt>.note-content").append('<div class="note-content-detail"><h5>' + j.NotesHighlightsContent + '</h5><h3>Saved on ' + j.CreatedOn + ' <img class="del-btn" data-id="' + j.Id + '" src="/static/icons/delete-highlights.svg" alt=""/></h3></div>');

        }
      } else {
        $("#mySidenavRgt>.note-content").empty()
      }
    }
  })
  $("#Textarea").val("");
});

/* Highlights */
var selection;
var selectedContent;
var selectedTag, s_offset, e_offset
var span
$(document).on("click", ".secton-content", function () {

  var startOffsetRelativeToP = 0;

  var endOffsetRelativeToP = 0;

  selection = window.getSelection()

  selectedContent = selection.toString();

  var range = selection.getRangeAt(0);

  selectedTag = range.startContainer.parentNode.innerText;

  console.log("--",range);

  var startContainerTagName = range.startContainer.parentNode.tagName.toLowerCase();

  var endContainerTagname = range.endContainer.parentNode.tagName.toLowerCase()

  if ((startContainerTagName == "span" && $(".secton-content span").hasClass("clear_clr")) || (endContainerTagname == "span" && $(".secton-content span").hasClass("clear_clr"))) {

    $(".hoverMenu").hide()

  } 

  if (endContainerTagname == "span" && $(".secton-content span").hasClass("selection")) {

    $(".hoverMenu").show()

  } 
  
  if ($(".secton-content div").hasClass("login-read")) {

    $(".hoverMenu").hide()
  }

  var startContainer = range.startContainer;

  var endContainer = range.endContainer;

  while (startContainer.previousSibling) {

    startContainer = startContainer.previousSibling;

    startOffsetRelativeToP += startContainer.textContent.length;

  }

  while (endContainer.previousSibling) {

    endContainer = endContainer.previousSibling;

    endOffsetRelativeToP += endContainer.textContent.length;
  }

  startOffsetRelativeToP += range.startOffset;

  endOffsetRelativeToP += range.endOffset;

  s_offset = startOffsetRelativeToP

  e_offset = endOffsetRelativeToP

  if(e_offset<s_offset) {

    e_offset = s_offset+ e_offset
  }

  span = document.createElement('span');

  span.classList.add('clear_clr')

  span.classList.add('selection')

  range.surroundContents(span);

  selection.removeAllRanges();
});

/* Colour select for Highlights */
$(document).on("click", ".clr", function () {
  var Pageid = $("#pgid").val();


  var htmlContent;
  var con_clr;
  var cl = $(this).attr("color-value")
  if (cl == "read") {
    var Speaker = false;
    var content = selectedContent
    if (Speaker) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    }
    Speaker = true;

    var utterance = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.speak(utterance);

    utterance.onend = function (event) {
      Speaker = false;
    };
  }

  if (cl == "yellow") {
    span.className = 'selected-yellow';
    con_clr = "rgba(255, 215, 82, 0.2)"
    htmlContent = '<h5 style="background-color: rgba(255, 215, 82, 0.2);">' + selectedContent + '</h5>'
  } if (cl == "pink") {
    span.className = 'selected-pink';
    con_clr = "rgba(247, 156, 156, 0.2)"
    htmlContent = '<h5 style="background-color: rgba(247, 156, 156, 0.2);">' + selectedContent + '</h5>'
  } if (cl == "green") {
    span.className = 'selected-green';
    con_clr = "rgba(77, 200, 142, 0.2)"
    htmlContent = '<h5 style="background-color: rgba(77, 200, 142, 0.2);">' + selectedContent + '</h5>'
  } if (cl == "blue") {
    span.className = 'selected-blue';
    con_clr = "rgba(106, 171, 250, 0.2)"
    htmlContent = '<h5 style="background-color: rgba(106, 171, 250, 0.2);">' + selectedContent + '</h5>'
  }
  // console.log(selectedTag);
  $.ajax({
    type: "post",
    url: "/highlights",
    dataType: 'json',
    data: {
      pgid: Pageid,
      content: htmlContent,
      selectedtag: JSON.stringify(selectedTag),
      startoffset: s_offset,
      endoffset: e_offset,
      con_clr: con_clr
    },
    success: function (result) {
      if (result.highlight.length > 0) {
        $("#mySidenavRgtHigh>.note-content").empty()
        for (let j of result.highlight) {
          $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail">' + j.NotesHighlightsContent + '<h3>Saved on ' + j.CreatedOn + 'pm <img class="del-btn" data-id="' + j.Id + '" src="/static/icons/delete-highlights.svg" alt=""/></h3></div>');
        }
      }
    }
  })

})


var ReadContent


$(document).ready(function () {

  $('.highlig').each(function () {

    var start = parseInt($(this).attr('data-start'));

    var offset = parseInt($(this).attr('data-offset'));

    var s_para = $(this).siblings('.selectParaaa').text().slice(1, -1)

    var c_clr = $(this).attr('data-color');

    $(".secton-content p").each(function () {

      var elementText = $(this).text()

      if (elementText == s_para) {

        var originalContent = $(this).text();

        var html = $(this).html()

        var content = originalContent.substring(start, offset);

        var highlightedContent = '<span class="clear_clr" style="background-color:' + c_clr + '">' + content + '</span>';

        $(this).html(html.replace(content, highlightedContent))
      }
    });

    $(".secton-content ol,ul").each(function () {

      $(this).children('li').each(function () {

        var elementText = $(this).text()

        if (elementText == s_para) {

          var originalContent = $(this).text();
  
          var html = $(this).html()
  
          var content = originalContent.substring(start, offset);
  
          var highlightedContent = '<span class="clear_clr" style="background-color:' + c_clr + '">' + content + '</span>';
  
          $(this).html(html.replace(content, highlightedContent))
        }
      })

    });

  })
})

// Function to escape special characters for regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


/* Read Button */
$(document).ready(function () {
  var speechContent = [];
  var Paused = false;
  var Speaking = false;
  var currentSpeech;
  $("#liveToastBtn").click(function () {
    if (Speaking) {

      window.speechSynthesis.cancel();
      Paused = false;
    }
    Speaking = true;
    var content = $(".content").text();
    var words = content.split(/\s+/);
    var ContentSize = 20;
    var NewContent = [];
    for (var i = 0; i < words.length; i += ContentSize) {
      NewContent.push(words.slice(i, i + ContentSize).join(' '));
    }
    speechContent = NewContent;
    speakNextChunk();

  });

  $('#pauseButton').click(function () {
    if (Speaking && !Paused) {
      if (currentSpeech) {
        currentSpeech.onend = null;
        window.speechSynthesis.pause();
        Paused = true;
      }
    }
  });

  $('#resumeButton').click(function () {
    if (Speaking && Paused) {
      window.speechSynthesis.resume();
      Paused = false;
      speakNextChunk();
    }
  });

  $('#read-cnl').click(function () {
    if (Speaking) {
      window.speechSynthesis.cancel();
      Paused = false;
    }
  });


  window.speechSynthesis.onend = function (event) {
    if (speechContent.length > 0) {
      speakNextChunk();
    } else {
      Speaking = false;
    }
  };

  function speakNextChunk() {
    if (Speaking && !Paused && speechContent.length > 0) {
      var chunk = speechContent.shift();
      var utterance = new SpeechSynthesisUtterance(chunk);
      currentSpeech = utterance;
      $('#liveToast .toast-header h2').text(chunk);
      window.speechSynthesis.speak(utterance);


      utterance.onend = function (event) {
        if (speechContent.length > 0) {
          speakNextChunk();
        } else {
          Speaking = false;
        }
      };
    }
  }
});

/* Copy function */
$('#copybtn').click(function () {

  var copyText = selectedContent

  navigator.clipboard.writeText(copyText);

});

/* Delete highlight */
$(document).on("click", ".del-btn", function () {
  var Pageid = $("#pgid").val();
  var del_id = $(this).attr('data-id')
  $.ajax({
    type: "post",
    url: "/deletehighlights",
    dataType: 'json',
    data: {
      id: del_id,
      pgid: Pageid
    },
    success: function (result) {
      if (result.note.length > 0) {
        $("#mySidenavRgt>.note-content").empty()
        for (let j of result.note) {
          $("#mySidenavRgt>.note-content").append('<div class="note-content-detail"><h5>' + j.NotesHighlightsContent + '</h5><h3>Saved on ' + j.CreatedOn + ' <img class="del-btn" data-id="' + j.Id + '" src="/static/icons/delete-highlights.svg" alt=""/></h3></div>');

        }
      } if (result.note.length == 0) {
        $("#mySidenavRgt>.note-content").empty()
      } if (result.highlight.length > 0) {
        $("#mySidenavRgtHigh>.note-content").empty()
        const section1Elements = document.querySelectorAll('.secton-content');

        section1Elements.forEach(element => {
          const spanElements = element.querySelectorAll('span');

          spanElements.forEach(spanElement => {
            spanElement.parentNode.replaceChild(spanElement.firstChild, spanElement);
          });
        });
        for (let j of result.highlight) {
          $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail">' + j.NotesHighlightsContent + '<h3>Saved on ' + j.CreatedOn + 'pm <img class="del-btn" data-id="' + j.Id + '" src="/static/icons/delete-highlights.svg" alt=""/></h3></div>');

          var start = j.HighlightsConfiguration.start
          var offset = j.HighlightsConfiguration.offset
          var s_para = j.HighlightsConfiguration.selectedpara
          var c_clr = j.HighlightsConfiguration.color
          $(".secton-content p").each(function () {
            var elementText = $(this).text();
            if (elementText === s_para) {
              var originalContent = $(this).text();
              var html = $(this).html()
              var content = originalContent.substring(start, offset);
              var highlightedContent = '<span class="clear_clr" style="background-color:' + c_clr + '">' + content + '</span>';
              $(this).html(html.replace(content, highlightedContent))
            }

          });
        }
      } if ((result.highlight.length == 0)) {
        $("#mySidenavRgtHigh>.note-content").empty()
        const section1Elements = document.querySelectorAll('.secton-content');

        section1Elements.forEach(element => {
          const spanElements = element.querySelectorAll('span');

          spanElements.forEach(spanElement => {
            spanElement.parentNode.replaceChild(spanElement.firstChild, spanElement);
          });
        });
      }
    }
  })

});

/* Font Style */
$(document).ready(function () {
  $(".smText").click(function () {
    $(".secton-content").find('*').removeClass("lgfont").addClass("smfont");
    // $(".section1").find('h1, h2, h3, h4, h5, h6,strong').removeClass("lgfont-h").addClass("smfont-h");

  });

  $(".lgText").click(function () {
    $(".secton-content").find('*').removeClass("smfont").addClass("lgfont");
    // $(".section1").find('h1, h2, h3, h4, h5, h6,strong').removeClass("smfont-h").addClass("lgfont-h");

  });
});

function highlightText(searchTerm) {
  // Get all elements containing text
  const elements = document.querySelectorAll(".secton-content p");
  // Loop through each element
  elements.forEach((element) => {
    const text = element.innerText;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    // Check if the element's text contains the search term
    if (text.match(regex)) {
      // Split the text into parts (matched and unmatched)
      const parts = text.split(regex);
      // Create a new HTML structure with the matched term highlighted
      const highlightedText = parts
        .map((part) =>
          part.match(regex)
            ? `<span style="background-color: yellow;">${part}</span>`
            : part
        )
        .join("");
      // Replace the original text with the highlighted version
      element.innerHTML = highlightedText;
    }
  });
}

var $div = $('.st-2');

// Check if the div has a vertical scrollbar
if ($div.get(0).scrollHeight > $div.innerHeight() || $div.get(0).scrollWidth > $div.innerWidth()) {

  $('.rght-arrow').show();

  $('.lft-arrow').show();
  
} else {

  $('.rght-arrow').hide();

  $('.lft-arrow').hide();
}

$(document).on('click','.lft-arrow',function(){
  
  var leftPos = $('.st-2').scrollLeft();
 
  $(".st-2").animate({scrollLeft: leftPos - 400},{duration: 500}, 1);

})

$(document).on('click','.rght-arrow',function(){
  
  var leftPos = $('.st-2').scrollLeft();
  
  $(".st-2").animate({scrollLeft: leftPos + 400},{duration: 500}, 1);

})

