/*jshint node:true*/
'use strict';

module.exports = function(/* environment, appConfig */) {
  const appleIcons = ["57x57", "60x60", "72x72", "76x76", "114x114", "120x120", "152x152", "180x180"];
  const favicons = ["16x16", "32x32", "96x96"];

  return {
    name: "Ember Montevideo Meetup",
    short_name: "Ember Montevideo Meetup",
    description: "Encuentra todas las novedades sobre la meetup de Ember Montevideo.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#e24c32",
    icons: appleIcons.map((size) => ({
             src: `assets/favicon/apple-icon-${size}.png`,
             sizes: size,
             type: "image/png"
           })).concat(favicons.map((size) => ({
             src: `assets/favicon-${size}.png`,
             sizes: size,
             type: "image/png",
             targets: ["favicon"]
           })))
  };
}
