// code for theme BEGIN HERE ================================
const primaryColorScheme = "light"; // "light" | "dark"

// Get theme data from local storage
const currentTheme = localStorage.getItem("theme");

function getPreferTheme() {
  // return theme value in local storage if it is set
  if (currentTheme) return currentTheme;

  // return primary color scheme if it is set
  if (primaryColorScheme) return primaryColorScheme;

  // return user device's prefer color scheme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferTheme();

function setPreference() {
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", themeValue);

  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  // Get a reference to the body element
  const body = document.body;

  // Check if the body element exists before using getComputedStyle
  if (body) {
    // Get the computed styles for the body element
    const computedStyles = window.getComputedStyle(body);

    // Get the background color property
    const bgColor = computedStyles.backgroundColor;

    // Set the background color in <meta theme-color ... />
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
}

// set early so no page flashes / CSS is made aware
reflectPreference();
// code for theme END HERE ================================



// code for language BEGIN HERE ===========================
const primaryLang = "id";
const currentLang = localStorage.getItem("language");

function getPreferLang() {
  if (currentLang) return currentLang;
    if (primaryLang) return primaryLang;
}
let langValue = getPreferLang();

function setLangPreference() {
  localStorage.setItem("language", langValue);
    reflectLangPreference();
}

function reflectLangPreference() {
    let idBtn = document.getElementById("id-btn");
    let enBtn = document.getElementById("en-btn");
    if (langValue === "en") {
        enBtn?.classList?.add("bg-button");
        idBtn?.classList?.remove("bg-button");
        idBtn?.classList?.add("bg-hover");
    } else if (langValue === "id") {
        idBtn?.classList?.add("bg-button");
        enBtn?.classList?.remove("bg-button");
        enBtn?.classList?.add("bg-hover");
    }
}
reflectLangPreference()
// end here ================================================



window.onload = () => {
    let currentUrl = window.location.pathname;
    let urlLang = currentUrl.slice(1,3);
    if (langValue==="en" && urlLang !== "en") {
        // window.location.href = '/en' + currentUrl;
        langValue = 'id';
        setLangPreference();
    }
    if (langValue === "id" && urlLang === "en") {
        langValue = 'en';
        setLangPreference();
    }

  function setThemeFeature() {
    // set on load so screen readers can get the latest value on the button
    reflectPreference();
    // now this script can find and listen for clicks on the control
    document.querySelector("#theme-btn")?.addEventListener("click", () => {
      themeValue = themeValue === "light" ? "dark" : "light";
      setPreference();
    });
  }
  setThemeFeature();
  // Runs on view transitions navigation
  document.addEventListener("astro:after-swap", setThemeFeature);


    function setLangFeature() {
        reflectLangPreference();
        document.querySelector("#id-btn")?.addEventListener("click", () => {
            let currentUrl = window.location.pathname;
            if (langValue === "en") {
                langValue = "id";
                setLangPreference();
                let newPage = currentUrl.slice(3);
                window.location.href = newPage;
            }
        });
        document.querySelector("#en-btn")?.addEventListener("click", () => {
            let currentUrl = window.location.pathname;
            if (langValue === "id") {
                langValue = "en";
                setLangPreference();
                let newPage = "/en" + currentUrl;
                window.location.href = newPage;
            }
        });
    }
  setLangFeature();
  document.addEventListener("astro:after-swap", setLangFeature);
};


// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? "dark" : "light";
    setPreference();
  });
