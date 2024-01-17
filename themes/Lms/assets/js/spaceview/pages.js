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
  console.log("sea", searchTerm);
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
  console.log("co", count);
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
  startOffsetRelativeToP += range.startOffset;
  endOffsetRelativeToP += range.endOffset;
  s_offset = startOffsetRelativeToP
  e_offset = endOffsetRelativeToP
  span = document.createElement('span');
  span.classList.add('clear_clr')
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
          $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail">' + j.NotesHighlightsContent + '<h3>Saved on ' + j.CreatedOn + 'pm <img class="del-btn" data-id="' + j.Id + '" src="/static/icons/delete-highlights.svg" alt=""/></h3></div>');
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
function AddPageString(name, pgid, space, pgslug, spid, Rpgid, Srpid) {

  var html
  if (pgid == Rpgid || pgid == Srpid) {
    html = `
   <div class="accordion-item accordion-item`+ pgid + `" data-id="` + pgid + `">
   <h2 class="accordion-header" id="headingOne"><a href="/space/` + space + `/` + pgslug + `?spid=` + spid + `&pageid=` + pgid + `">
   <button class="accordion-button page" data-id="` + pgid + `" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne` + pgid + `"
    aria-expanded="true" aria-controls="collapseOne">` + name + `
    </button></a>
    </h2>
   </div>`
  } else {
    html = `
   <div class="accordion-item accordion-item`+ pgid + `" data-id="` + pgid + `">
   <h2 class="accordion-header" id="headingOne"><a href="/space/` + space + `/` + pgslug + `?spid=` + spid + `&pageid=` + pgid + `">
   <button class="accordion-button page collapsed" data-id="` + pgid + `" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne` + pgid + `"
    aria-expanded="false" aria-controls="collapseOne">` + name + `
    </button></a>
    </h2>
   </div>`
  }

  return html
}
/*addsub page string */
function AddSubPageString(value, parentid, id, space, pgslug, subslug, spid, Rpgid, Srpid) {
  var html;
  console.log("fgh", (Rpgid == parentid || Srpid == parentid), Srpid);
  if (Rpgid == parentid || Srpid == parentid) {
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
// $(document).ready(function () {
//   var spsulg = $("#spSulg").val()
//   var spid = $("#spid").val();
//   var Rpgid = $("#pgid").val();
//   var Srpid;
//   $.ajax({
//     type: "get",
//     url: "/page",
//     dataType: 'json',
//     data: {
//       sid: spid,
//       pid: Rpgid,
//     },
//     cache: false,
//     success: function (result) {
//       if (result.group != null) {
//         newGroup = result.group
//       }
//       if (result.pages != null) {
//         newpages = result.pages
//       }
//       if (result.subpage != null) {
//         Subpage = result.subpage
//       }
//       if (result.note != null) {
//         for (let j of result.note) {

//           $("#mySidenavRgt>.note-content").append('<div class="note-content-detail"><h5>' + j.NotesHighlightsContent + '</h5><h3>Saved on ' + j.CreatedOn + 'pm <img class="del-btn" data-id="' + j.Id + '" src="/static/icons/delete-highlights.svg" alt=""/></h3></div>');
//         }
//       }
//       for (let j of Subpage) {
//         if (j['SpgId'] == Rpgid) {

//           Srpid = j['ParentId']

//         }
//         console.log("Srpid", Srpid);
//       }

//       if (newpages.length > 0 || newGroup.length > 0) {
//         overallarray = overallarray.concat(newpages, newGroup)
//         console.log("overallarry", overallarray);
//         PGList(spsulg, spid, Rpgid, Srpid)
//         for (let j of newpages) {
//           if (j['OrderIndex'] == 1) {
//             $("#Title").text(result.content.PageTitle)
//             if (result.error != "") {


//               if (result.error == "login required") {
//                 var html = `<div class="login-read">
//                 <h3>    
//                 Hey, you have logged in as a Guest User
//                 </h3>
//                 <p>To access the screens of the CMS for which you have the permission, login as a Member User. 
//                 .</p>
//                 <a href="/login">  <button> Log In</button> </a> </div>`
//                 $(".secton-content").append(html)
//               } else {
//                 var html = `<div class="login-read">
//                 <h3>
//                 Oops !!!
//                 </h3>
//                 <p>Seems like you do not have member permission to access this screen. You may access only those screens for which you hold granted member permission. </p>
//                  </div>`
//                 $(".secton-content").append(html)
//               }
//             } else {
//               $(".secton-content").append(result.content.PageDescription)
//               ReadContent = $(".secton-content").html()
//             }
//           }

//         }
//       }
//       if (result.highlight != null) {
//         var Highlight = result.highlight
//         for (let j of Highlight) {
//           $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail">' + j.NotesHighlightsContent + '<h3>Saved on ' + j.CreatedOn + 'pm <img class="del-btn" data-id="' + j.Id + '" src="/static/icons/delete-highlights.svg" alt=""/></h3></div>');
//           var start = j.HighlightsConfiguration.start
//           var offset = j.HighlightsConfiguration.offset
//           var s_para = j.HighlightsConfiguration.selectedpara
//           var c_clr = j.HighlightsConfiguration.color
//           $(".secton-content p").each(function () {
//             var elementText = $(this).text();
//             if (elementText === s_para) {
//               var originalContent = $(this).text();
//               var html = $(this).html()
//               var content = originalContent.substring(start, offset);
//               var highlightedContent = '<span class="clear_clr" style="background-color:' + c_clr + '">' + content + '</span>';
//               $(this).html(html.replace(content, highlightedContent))
//             }

//           });


//         }

//       }

//     }
//   })
//   $('.togglebtn').trigger('click');
// });

function PGList(spslug, spid, Rpgid, Srpid) {


  $('.accordion').html('');

  for (let x of overallarray) {

    orderindex = x['OrderIndex']

    /**this page */
    if (x['PgId'] !== undefined && x['Pgroupid'] == 0) {

      var pa = x['Name']

      var s_remove = pa.toLowerCase().replace(/ /g, '_');

      var pgslug = s_remove.replace('?', '');


      var AddPage = AddPageString(x['Name'], x['PgId'], spslug, pgslug, spid, Rpgid, Srpid);

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

          var AddPage = AddPageString(y['Name'], y['PgId'], spslug, pgslug, spid, Rpgid, Srpid)

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

        var AddSubPage = AddSubPageString(j['Name'], j['ParentId'], j['SpgId'], spslug, pgslug, subslug, spid, Rpgid, Srpid)

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