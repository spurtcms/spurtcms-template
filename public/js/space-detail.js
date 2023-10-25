/* Search Input */
$("input[name='sname']").keyup(function () {
  $(".srch-arrow").addClass("div-show");
  $(".reset-inpt").attr("type", "reset");
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
    let posXAdjusted = posX - colorPickerWidth / 2;

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

var $content;
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
  $content.find('.highlight-content').contents().unwrap();
})

/* Search and Highlight */
$(document).ready(function () {
  var $searchInput = $('#search-data');
  var $mainDiv = $('#centerSection');
  var $count = $("#count");
  var currentIndex = 0;
  $content = $mainDiv.find('h3,p');

  $searchInput.on('input', function () {
    var searchTerm = $searchInput.val().trim();
    $content.find('.highlight-content').contents().unwrap();

    if (searchTerm.length === 0) {
      cont = 0;
      currentIndex = 0;
      $count.text("0 of 0");
      return;
    }

    var regex = new RegExp('\\b' + escapeRegExp(searchTerm), 'gi');
    cont = 0;
    currentIndex = 0;

    $content.each(function () {
      var $this = $(this);
      if (regex != "") {
        if ($this.text().match(regex)) {
          $this.html(function (_, html) {
            cont++;
            return html.replace(regex, '<span class="highlight-content">$&</span>');
          });
        }
      }
    });
    updateCount();
  });

  function updateCount() {
    $count.text((currentIndex + 1) + " of " + cont);
    focusCurrentIndex();
  }
  function focusCurrentIndex() {
    var highlightedWords = $(".highlight-content");

    if (cont > 0) {
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
    if (cont > 0) {
      currentIndex = (currentIndex - 1 + cont) % cont;
      updateCount();
    }
  });

  $("#down-icon").click(function () {
    if (cont > 0) {
      currentIndex = (currentIndex + 1) % cont;
      updateCount();
    }
  });

});

/* Notes and save */
$(document).on('click', '#save-btn', function () {
  var text = $("#Textarea").val();
  $("#mySidenavRgt>.note-content").append('<div class="note-content-detail"><h5>' + text + '</h5><span>Saved on 27sep23, 06:15pm</span></div>');

  $("#Textarea").val("");
});

/* Highlights */
var selection;
var selectedContent;
var span
$(document).on("click", ".content", function () {
  selection = window.getSelection()
  selectedContent = selection.toString();
  var range = selection.getRangeAt(0);
  span = document.createElement('span');
  range.surroundContents(span);

  /* Selection Clear */
  selection.removeAllRanges();
  // console.log("selection", selection);
  // console.log("selectedContent", selectedContent);
});

/* Colour select for Highlights */
$(document).on("click", ".clr", function () {
  var cl = $(this).attr("color-value")
  if (cl == "yellow") {
    span.className = 'selected-yellow';
    $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail"><h5 style="background-color: rgba(255, 215, 82, 0.2);">' + selectedContent + '</h5><span>Saved on 27sep23, 06:15pm</span></div>');
  } if (cl == "pink") {
    span.className = 'selected-pink';
    $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail"><h5 style="background-color: rgb(247, 156, 156, 0.2);">' + selectedContent + '</h5><span>Saved on 27sep23, 06:15pm</span></div>');
  } if (cl == "green") {
    span.className = 'selected-green';
    $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail"><h5 style="background-color: rgba(106, 171, 250, 0.2);">' + selectedContent + '</h5><span>Saved on 27sep23, 06:15pm</span></div>');
  } if (cl == "blue") {
    span.className = 'selected-blue';
    $("#mySidenavRgtHigh>.note-content").append('<div class="note-content-detail"><h5 style="background-color: rgba(77, 200, 142, 0.2);">' + selectedContent + '</h5><span>Saved on 27sep23, 06:15pm</span></div>');

  }
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
function AddPageString(name, pgid) {

  return `
  <div class="accordion-item page accordion-item`+ pgid + `" data-id="` + pgid + `">
  <h2 class="accordion-header" id="headingOne">
  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne`+ pgid + `"
   aria-expanded="false" aria-controls="collapseOne">` + name + `
   </button>
   </h2>
  </div>`
}
/*addsub page string */
function AddSubPageString(value, dataid) {
  return `
  <div id="collapseOne`+ dataid + `" class="accordion-collapse page collapse" aria-labelledby="headingOne"
  data-bs-parent="#accordionExample">
  <div class="accordion-body">
  <p>` + value + `</p>
  </div>
 </div>`
}

/* List Page */
$(document).ready(function () {
  $.ajax({
    type: "get",
    url: "/page",
    dataType: 'json',
    data: {
      sid: $("#spid").val(),
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

      if (newpages.length > 0 || newGroup.length > 0) {
        overallarray = overallarray.concat(newpages, newGroup)
        PGList()
        for (let j in newpages) {
          if (j == 0) {
            $("#Title").text(newpages[j]['Name'])
            $(".secton-content").append(newpages[j]['Content'])
          }

        }
      }

    }
  })

});


function PGList() {

  $('.accordion').html('');
  for (let x of overallarray) {

    orderindex = x['OrderIndex']

    /**this page */
    if (x['PgId'] !== undefined && x['Pgroupid'] == 0) {

      var AddPage = AddPageString(x['Name'], x['PgId']);

      $('.accordion').append(AddPage);

      for (let j of Subpage) {

        if (j['ParentId'] == x['PgId']) {

          var AddSubPage = AddSubPageString(j['Name'], x['ParentId'])

          $('.accordion-item' + j['ParentId']).append(AddSubPage)

        }

      }


    }

    /**this Group */
    if (x['GroupId'] !== undefined && x['GroupId'] != 0 && x['NewGroupId'] == 0 && x['PgId'] === undefined) {

      var AddGroup1 = AddGroupString(x['Name'], x['GroupId'])

      $('.accordion').append(AddGroup1)

      for (let y of overallarray) {

        if ((x['GroupId'] == y['Pgroupid']) && y['GroupId'] === undefined) {

          var AddPage = AddPageString(y['Name'], y['PgId'])

          $('.groupdiv' + x['GroupId']).append(AddPage)

        }

      }

    }

  }

  for (let x of overallarray) {

    /**this sub */
    for (let j of Subpage) {
      if (j['ParentId'] == x['PgId']) {

        suborderindex = j['OrderIndex']

        var AddSubPage = AddSubPageString(j['Name'], j['ParentId'])

        $('.accordion-item' + j['ParentId']).append(AddSubPage)

      }

    }
  }
}
/* Page Content View */
$(document).on('click', '.page', function () {
  $("#Title").empty();
  $(".secton-content").empty();
  var pgid = $(this).attr("data-id")
  for (let j of newpages) {
    if (j['PgId'] == pgid) {
      $("#Title").text(j['Name'])
      $(".secton-content").append(j['Content'])

    }

  }
})
