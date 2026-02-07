
  const imageSelector = document.getElementById("imageSelector");
  const coloringImage = document.getElementById("coloringImage");

  imageSelector.addEventListener("change", function () {
    coloringImage.src = this.value;
  });

