$(document).ready(function () {
  $(".post-container").each(function () {
    var $images = $(this).find("img");
    if (!$images.length) {
      return;
    }

    var items = $images
      .map(function () {
        return { src: $(this).attr("src") };
      })
      .get();

    $images.on("click", function (e) {
      e.preventDefault();
      var index = $images.index(this);

      $.magnificPopup.open(
        {
          items: items,
          type: "image",
          closeOnContentClick: true,
          showCloseBtn: false,
          gallery: {
            enabled: items.length > 1,
          },
        },
        index
      );
    });
  });
});
