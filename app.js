let controller;
let slideScene;
let pageScene;
let detailScene;


//Functions

//----**We have basicaly covered our texts and images with div having same colored as our background. This function is for
// removing those divs and adding somea nimations when scrolling using GSAP**----
function animateSlides() {
    //Init Controller
    controller = new ScrollMagic.Controller();
    //Selecting things
    const sliders = document.querySelectorAll(".slide");
    const nav = document.querySelector(".nav-header");
    //Loop over each slide
    sliders.forEach((slide,index, slides) => {
        const revealImg = slide.querySelector(".reveal-img");
        const img = slide.querySelector("img");
        const revealText = slide.querySelector(".reveal-text");
        //GSAP
            const slideTl = gsap.timeline({defaults: {duration : 1, ease : "power2.inOut"}});
            // Syntax fromTo(tomodifyobject, {x: "from"}, {x: "to"})
            slideTl.fromTo(revealImg, {x: "0%"}, {x: "100%"});
            //-=1 for starting it 1s earlier as it occurs after our fisrt animation ends
            //We have added overflow hidden to css as the scale 2 makes our image larger than our div            
            slideTl.fromTo(img, {scale: 2}, {scale : 1}, "-=1");     
            slideTl.fromTo(revealText, {x: "0%"}, {x: "100%"}, "-=0.75");  
            //We have to add overflowx hidden to our body as we are sliding our divs and sliders appear on our page
           slideTl.fromTo(nav, {y: "-100%"}, {y: "0%"}, "-=0.75"); 

            //Scene for sroll animation
            slideScene = ScrollMagic.Scene({ 
                triggerElement : slide,
                triggerHook : 0.25,
                reverse : false
            })
            // .setTween(slideTl)
            // .addIndicators({colorStart: "white", colorTrigger : "white", name : "slide"})
            .addTo(controller);
            //New Animation 
            const pageTl = gsap.timeline();
            let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
            pageTl.fromTo(nextSlide, {y : "0%"}, {y: "50%"});
            pageTl.fromTo(slide, {opacity : 1, scale : 1}, {opacity : 0, scale: 0 });
            pageTl.fromTo(nextSlide, {y : "50%"}, {y: "0%"}, "-=0.45");
            //Scene for page
            pageScene = new ScrollMagic.Scene({
                triggerElement : slide,
                duration : "100%",
                triggerHook : 0
            })
            //set pin helps to make the page stuck from start to end point as per our duration
            .setPin(slide, {pushFollowers : false})
            .setTween(pageTl)
            // .addIndicators({colorStart: "white", colorTrigger : "white", name : "page", indent : 200})
            .addTo(controller);
    });
}

//----**Cursor Animation**----
const  mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");
function cursor(e) {
    mouse.style.top = e.pageY + "px";
    mouse.style.left = e.pageX + "px";
}
function activeCurosr(e) {
    const item = e.target;
    if (item.id === "logo" || item.classList.contains("burger")) {
      mouse.classList.add("nav-active");
    } else {
      mouse.classList.remove("nav-active");
    }
    if (item.classList.contains("explore")){
        mouse.classList.add("explore-active");
        mouseTxt.innerText = "Tap";
        gsap.to(".title-swipe", 1, {y: "0%"});
    } else {
        mouse.classList.remove("explore-active");
        mouseTxt.innerText = "";
        gsap.to(".title-swipe", 1, {y: "100%"});
    }
}
//----**Burger animation**----
//Make sure to add position relative to nav-header for showing them on nav links
function navToggle(e) {
    if (!e.target.classList.contains("active")) {
      e.target.classList.add("active");
      gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
      gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
      gsap.to("#logo", 1, { color: "black"});
      gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
      document.body.classList.add("hide");
    } else {
      e.target.classList.remove("active");
      gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
      gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
      gsap.to("#logo", 1, { color: "white" });
      gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
      document.body.classList.remove("hide");
    }
  }

  //----****Barba JS****----
//Envoking Baraba JS
const logo = document.querySelector("#logo");
barba.init({
  views : [
    //Pages where we want to add transition
    {
      namespace : "home",
      beforeEnter() {
         //Functionality to be added only on this page
        animateSlides();
        logo.href = "./index.html"
      },
      beforeLeave(){
        //Functionality to be be destroyed when leaving this page
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
        //Updating our href of index pages as it don't upgrade itself when we add wrapper to body
        logo.href = "../index.html"
      }
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions : [
    {
      leave({current,next}) {
        //this.async is a way to tell barba to start next after current
        let done = this.async();
        //current = this page & next = next page
        const tl = gsap.timeline({defaults : {ease : "power2.inOut"}});
        //current.container to access current page's container
        tl.fromTo(current.container, 1, {opacity : 1}, {opacity : 0 });
        tl.fromTo(".swipe", 0.75, {x : "-100%"}, {x : "0%", onComplete : done}, "-=0.5");
      },
    enter({current, next}){
      let done = this.async();
      //Scroll to the top as our next page is loaded at bottom
      window.scrollTo(0, 0);
      const tl = gsap.timeline({defaults : {ease : "power2.inOut"}});
      //  Page Trasnition Anitmation :Stagger helps to add delay effect
      tl.fromTo(".swipe", 0.75, {x : "0%"}, {x : "100%", stagger: 0.25, onComplete : done});
      tl.fromTo(next.container, 1, {opacity : 0}, {opacity : 1});
      tl.fromTo(".nav-header", 1, {y : "-100%"}, {y:"0%", ease : "power2.inOut"}, "-=1.5");
    }
    }
  ]
});

function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0}, { opacity: 1}, "-=1");
    slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
    //Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "detailScene"
      // })
      .addTo(controller);
  });
}


//Event Listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCurosr);

