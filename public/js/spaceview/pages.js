/* Search Input */
$("input[name='sname']").keyup(function () {
  $(".srch-arrow").addClass("div-show");
  $(".reset-inpt").attr("type", "reset");
  search()
});
$(document).ready(function () {
  var Id = $("#spid").val()
  $('.tablinks[sp-id=' + Id + ']').addClass('active')
})
/* HoverMenu */
var clientX, clientY;
document.addEventListener("mousedown", function (event) {
  clientX = event.pageX;
  clientY = event.pageY;
});

document.querySelector("#centerSection").addEventListener("mouseup", () => {
  let selectionFromDocument = document.getSelection();
  let textValue = selectionFromDocument.toString();
  var hoverMenu = document.querySelector(".hoverMenu");
  var colorPicker = document.querySelector(".color-picker");

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

    hoverMenu.style.left = posXAdjusted + "px";
    let posY = rect.top + window.scrollY - 150 + "px";
    hoverMenu.style.top = posY;

    // Set the position of the color-picker
    colorPicker.style.left = posXAdjusted + "px";
    colorPicker.style.top = posY;
  }
});

var content;
var cont = 0;

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
  content.find('.highlight-content').contents().unwrap();
})

var count

/* Search and Highlight */
function search() {
  var searchInput = $('#search-data');
  console.log("searchInput", searchInput);
  var mainDiv = $('#centerSection');
  var countVal = $("#count");
  var currentIndex = 0;
  content = mainDiv.find('h3,p,span');
  console.log("content", content);
  var searchTerm = searchInput.val().trim();
  console.log("searchTerm", searchTerm);
  content.find('.highlight-content').contents().unwrap();
  if (searchTerm.length === 0) {
    count = 0;
    currentIndex = 0;
    countVal.text("0 of 0");
    return;
  }
  var regex = new RegExp('\\b' + escapeRegExp(searchTerm), 'gi');
  console.log("regex", regex);
  currentIndex = 0;
  content.each(function () {
    var $this = $(this);
    if (regex.test($this.text())) {
        $this.html(function (_, html) {
          if($this.find('span').length > 0){

            if (regex.test($this.find('span').text())){
              return $this.find('span').html().replace(regex, '<span class="highlight-content">$&</span>');

            }


          
          }else{
            return html.replace(regex, '<span class="highlight-content">$&</span>');

          }
        });
    }
});



  var text = content.find('.highlight-content')

  count = text.length

  updateCount();
  function updateCount() {
    countVal.text((currentIndex + 1) + " of " + count);
    focusCurrentIndex();
  }
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

        // Scroll smoothly to the desired position
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
  function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  $("#up-icon").click(function () {
    if (count > 0) {
      currentIndex = (currentIndex - 1 + count) % count;
      updateCount();
    }
  });

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
            $("#mySidenavRgt>.note-content").append('<div class="note-content-detail"><h5>' + j.NotesHighlightsContent + '</h5><h3>Saved on ' + j.CreatedOn + ' <img class="del-btn" data-id="' + j.Id + '" src="/public/images/delete-highlights.svg" alt=""/></h3></div>');

          }
        } else {
          $("#mySidenavRgt>.note-content").empty()
        }
      }
    })
    $("#Textarea").val("");
  });
}
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
  var startContainerTagName = range.startContainer.parentNode.tagName.toLowerCase();
  var endContainerTagname = range.endContainer.parentNode.tagName.toLowerCase()
  if ((startContainerTagName == "span" && $(".secton-content span").hasClass("clear_clr")) || (endContainerTagname == "span" && $(".secton-content span").hasClass("clear_clr"))) {
    $(".hoverMenu").hide()
  } if ($(".secton-content div").hasClass("login-read")) {
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
  // Adjust the offsets
  startOffsetRelativeToP += range.startOffset;
  endOffsetRelativeToP += range.endOffset;
  s_offset = startOffsetRelativeToP
  e_offset = endOffsetRelativeToP
  span = document.createElement('span');
  span.classList.add('clear_clr')
  range.surroundContents(span);
  /* Selection Clear */
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
    con_clr = "rgba(106, 171, 250, 0.2)"
    htmlContent = '<h5 style="background-color: rgba(106, 171, 250, 0.2);">' + selectedContent + '</h5>'
  } if (cl == "blue") {
    span.className = 'selected-blue';
    con_clr = "rgba(77, 200, 142, 0.2)"
    htmlContent = '<h5 style="background-color: rgba(77, 200, 142, 0.2);">' + selectedContent + '</h5>'
  }
  $.ajax({
    type: "post",
    url: "/highlights",
    dataType: 'json',
    data: {
      pgid: Pageid,
      content: htmlContent,
      selectedtag: selectedTag,
      startoffset: s_offset,
      endoffset: e_offset,
      con_clr: con_clr
    },
    success: function (result) {
      if (result.highlight.length > 0) {
        $("#mySidenavRgtHigh>.note-content").empty()
        for (let j of result.highlight) {
          $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail">' + j.NotesHighlightsContent + '<h3>Saved on ' + j.CreatedOn + 'pm <img class="del-btn" data-id="' + j.Id + '" src="/public/images/delete-highlights.svg" alt=""/></h3></div>');
        }
      }
    }
  })

})

/* List Page */

var newpages = []

var newGroup = []

var Subpage = []

var overallarray = []

/**Add pagegroup string */
function AddGroupString(groupname, gid) {
  return `
   <div class="groupdiv groupdiv`+ gid + `">
      <h3 class="gry-txt">` + groupname + `</h3>
   </div>`
}
/**Add page string */
function AddPageString(name, pgid, space, pgslug, spid, Rpgid) {

  var html
  if (pgid == Rpgid) {
    html = `<a href="/space/` + space + `/` + pgslug + `?spid=` + spid + `&pageid=` + pgid + `">
   <div class="accordion-item accordion-item`+ pgid + `" data-id="` + pgid + `">
   <h2 class="accordion-header" id="headingOne">
   <button class="accordion-button page" data-id="` + pgid + `" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne` + pgid + `"
    aria-expanded="true" aria-controls="collapseOne">` + name + `
    </button>
    </h2>
   </div></a>`
  } else {
    html = `<a href="/space/` + space + `/` + pgslug + `?spid=` + spid + `&pageid=` + pgid + `">
   <div class="accordion-item accordion-item`+ pgid + `" data-id="` + pgid + `">
   <h2 class="accordion-header" id="headingOne">
   <button class="accordion-button page collapsed" data-id="` + pgid + `" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne` + pgid + `"
    aria-expanded="false" aria-controls="collapseOne">` + name + `
    </button>
    </h2>
   </div></a>`
  }

  return html
}
/*addsub page string */
function AddSubPageString(value, parentid, id, space, pgslug, subslug, spid, Rpgid) {
  var html;
  if (Rpgid == parentid || id == Rpgid) {
    html = `<a href="/space/` + space + `/` + pgslug + `/` + subslug + `?spid=` + spid + `&pageid=` + id + `">
   <div id="collapseOne`+ parentid + `" class="accordion-collapse  collapse show" aria-labelledby="headingOne"
   data-bs-parent="#accordionExample " data-parent="`+ parentid + `">
   <div class="accordion-body subpage" data-id="` + id + `">
   <p>` + value + `</p>
   </div>
  </div></a>`
  } else {
    html = `<a href="/space/` + space + `/` + pgslug + `/` + subslug + `?spid=` + spid + `&pageid=` + id + `">
   <div id="collapseOne`+ parentid + `" class="accordion-collapse  collapse" aria-labelledby="headingOne"
   data-bs-parent="#accordionExample" data-parent="`+ parentid + `">
   <div class="accordion-body subpage" data-id="` + id + `">
   <p>` + value + `</p>
   </div>
  </div></a>`
  }
  return html
}

var ReadContent

/* List Page */
$(document).ready(function () {
  var spsulg = $("#spSulg").val()
  var spid = $("#spid").val();
  var Rpgid = $("#pgid").val();
  $.ajax({
    type: "get",
    url: "/page",
    dataType: 'json',
    data: {
      sid: $("#spid").val(),
      pid: Rpgid,
    },
    cache: false,
    success: function (result) {
      if (result.group != null) {
        newGroup = result.group
      }
      if (result.pages != null) {
        newpages = result.pages
      }
      if (result.subpage != null) {
        Subpage = result.subpage
      }
      if (result.note != null) {
        for (let j of result.note) {

          $("#mySidenavRgt>.note-content").append('<div class="note-content-detail"><h5>' + j.NotesHighlightsContent + '</h5><h3>Saved on ' + j.CreatedOn + 'pm <img class="del-btn" data-id="' + j.Id + '" src="/public/images/delete-highlights.svg" alt=""/></h3></div>');
        }
      }

      if (newpages.length > 0 || newGroup.length > 0) {
        overallarray = overallarray.concat(newpages, newGroup)
        PGList(spsulg, spid, Rpgid)
        for (let j of newpages) {
          if (j['OrderIndex'] == 1) {
            $("#Title").text(j['Name'])
            if (result.error != "") {


              if (result.error == "login required") {
                var html = `<div class="login-read">
                <h3>    
                Hey, you have logged in as a Guest User
                </h3>
                <p>To access the screens of the CMS for which you have the permission, login as a Member User. 
                .</p>
                <a href="/login">  <button> Log In</button> </a> </div>`
                $(".secton-content").append(html)
              } else {
                var html = `<div class="login-read">
                <h3>
                Oops !!!
                </h3>
                <p>Seems like you do not have member permission to access this screen. You may access only those screens for which you hold granted member permission. </p>
                 </div>`
                $(".secton-content").append(html)
              }
            } else {
              $(".secton-content").append(result.content)
              ReadContent = $(".secton-content").html()
            }
          }

        }
      }
      if (result.highlight != null) {
        var Highlight = result.highlight
        for (let j of Highlight) {
          $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail">' + j.NotesHighlightsContent + '<h3>Saved on ' + j.CreatedOn + 'pm <img class="del-btn" data-id="' + j.Id + '" src="/public/images/delete-highlights.svg" alt=""/></h3></div>');
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

      }

    }
  })
  $('.togglebtn').trigger('click');
});

function PGList(spslug, spid, Rpgid) {


  $('.accordion').html('');

  for (let x of overallarray) {

    orderindex = x['OrderIndex']

    /**this page */
    if (x['PgId'] !== undefined && x['Pgroupid'] == 0) {

      var pa = x['Name']

      var s_remove = pa.toLowerCase().replace(/ /g, '_');

      var pgslug = s_remove.replace('?', '');


      var AddPage = AddPageString(x['Name'], x['PgId'], spslug, pgslug, spid, Rpgid);

      $('.accordion').append(AddPage);
    }

    /**this Group */
    if (x['GroupId'] !== undefined && x['GroupId'] != 0 && x['NewGroupId'] == 0 && x['PgId'] === undefined) {

      var AddGroup1 = AddGroupString(x['Name'], x['GroupId'])

      $('.accordion').append(AddGroup1)

      for (let y of overallarray) {

        if ((x['GroupId'] == y['Pgroupid']) && y['GroupId'] === undefined) {

          var pa = y['Name']

          var s_remove = pa.toLowerCase().replace(/ /g, '_');

          var pgslug = s_remove.replace('?', '');

          var AddPage = AddPageString(y['Name'], y['PgId'], spslug, pgslug, spid, Rpgid)

          $('.groupdiv' + x['GroupId']).append(AddPage)

        }

      }

    }

  }

  for (let x of overallarray) {

    /**this sub */
    for (let j of Subpage) {


      if (j['ParentId'] == x['PgId']) {

        $('.page[data-id=' + x['PgId'] + ']').addClass("addnew")

        var pa = x['Name']

        var s_remove = pa.toLowerCase().replace(/ /g, '_');

        var pgslug = s_remove.replace('?', '');

        suborderindex = j['OrderIndex']

        var sp = j['Name']

        var Sb_remove = sp.toLowerCase().replace(/ /g, '_');

        var subslug = Sb_remove.replace('?', '')

        var AddSubPage = AddSubPageString(j['Name'], j['ParentId'], j['SpgId'], spslug, pgslug, subslug, spid, Rpgid)

        $('.accordion-item' + j['ParentId']).append(AddSubPage)


      }

    }
  }
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
          $("#mySidenavRgt>.note-content").append('<div class="note-content-detail"><h5>' + j.NotesHighlightsContent + '</h5><h3>Saved on ' + j.CreatedOn + ' <img class="del-btn" data-id="' + j.Id + '" src="/public/images/delete-highlights.svg" alt=""/></h3></div>');

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
          $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail">' + j.NotesHighlightsContent + '<h3>Saved on ' + j.CreatedOn + 'pm <img class="del-btn" data-id="' + j.Id + '" src="/public/images/delete-highlights.svg" alt=""/></h3></div>');

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
