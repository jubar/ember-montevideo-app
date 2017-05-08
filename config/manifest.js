/*jshint node:true*/
'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    name: "Ember Montevideo Meetup",
    short_name: "Ember Montevideo Meetup",
    description: "Encuentra todas las novedades sobre la meetup de Ember Montevideo.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#e24c32",
    icons: [
      {
        src: "assets/favicon/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png"
      },
      {
        src: "assets/favicon/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png"
      },
      {
        src: "assets/favicon/apple-icon-72x72.png",
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: "assets/favicon/apple-icon-76x76.png",
        sizes: "76x76",
        type: "image/png"
      },
      {
        src: "assets/favicon/apple-icon-114x114.png",
        sizes: "114x114",
        type: "image/png"
      },
      {
        src: "assets/favicon/apple-icon-120x120.png",
        sizes: "120x120",
        type: "image/png"
      },
      {
        src: "assets/favicon/apple-icon-152x152.png",
        sizes: "152x152",
        type: "image/png"
      },
      {
        src: "assets/favicon/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png"
      },
    ]
  };
}
