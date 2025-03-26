import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '.././styles/index.css';
import '.././styles/navbar.css';

const HomePage = () => {
  return (
    <div>
      {/* Navbar Start */}
      <div id="navbar"></div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-section-div">
          <h5>On-demand</h5>
          <h1>Online vet appointments.</h1>
          <p>
            VetCare connects pet owners to thousands of licenced veterinary surgeons & nurses ready to provide the best
            online vet services through video chat appointments 24/7.
          </p>
          <div id="redirectBtn"></div>
        </div>
        <div className="hero-section-img"></div>
      </div>

      {/* Book with confidence Section */}
      <div className="book-with-confidence">
        <div className="book-with-confidence-innerText">
          <p>
            <span>Book with confidence. </span> Licensed veterinarians* to help you manage your pets health.
          </p>
        </div>
        <div className="book-with-confidence-innerDiv">
          <div className="book-card">
            <img src="https://cloud.vetster.com/images/vetster-vet-video-appt.svg" alt="" />
            <h3>Convenience for when you have a pet health concern</h3>
            <p>
              If you are unable or if visiting your local clinic is challenging for you, we're here for all your pet
              health concerns, big or small.
            </p>
          </div>
          <div className="book-card">
            <img src="https://cloud.vetster.com/images/vetster-phone-vet.svg" alt="" />
            <h3>Here when you need us with 24/7 online veterinary telehealth consult</h3>
            <p>
              Vetcare has online vets available 24/7. We're here to help answer your questions, provide teletriage
              service, and help you with next steps for your pet.
            </p>
          </div>
          <div className="book-card">
            <img src="https://cloud.vetster.com/images/vetster-user-with-pet.svg" alt="" />
            <h3>Simple, easy-to-use care solution from the comfort of your home</h3>
            <p>
              Using Vetcare makes it easy for you to see a vet from the comfort of your own home. With Vetcare you and
              your pet can be stress free!
            </p>
          </div>
        </div>
        <p>
          Video chat appointments will be facilitated with a veterinarian licensed in Canada, the United Kingdom or the
          US. Prescriptions and diagnosis are not available.
        </p>
      </div>

      {/* Banner Section */}
      <div className="banner-div flex">
        <div>
          <img src="https://cloud.vetster.com/images/vetster-phone-vet.svg" alt="" />
        </div>
        <div className="banner-innerDiv">
          <h3>What can virtual vets help you with?</h3>
          <p>
            Vets in Canada, United Kingdom and the US can talk you through a variety of health issues and offer guidance
            for taking care of your pet. Vetster veterinarians can work with new and existing patients to understand
            health and wellness issues, and in some cases they may suggest over-the-counter products, or provide you
            with peace of mind knowing your pet is in good hands.
          </p>
        </div>
      </div>

      {/* Pet parents section */}
      <div className="pet-parents">
        <h1>Pet parents love what we do!</h1>
        <div>
          <p>Using Vetcare is simple and enjoyable! Here is what some our satisfied pet parents have to say…</p>
        </div>
        <div id="logos-home-page">
          <div className="slider">
            <div className="slide-track">
              <div className="slide">
                <div className="ratings">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>

                <p style={{ fontSize: '16px', height: '120px' }}>
                  “I am not in a position where I can go to a vet during the week so having this appointment was very
                  helpful. Dr Martin was very professional and friend...”
                </p>

                <div className="rater">
                  <div className="circle flex" style={{ width: '50px', height: '50px' }}>
                    <i className="fa-solid fa-h"></i>
                  </div>
                  <div className="raterDetail">
                    <h4>Hannah</h4>
                    <p style={{ fontSize: '12px', width: '100px' }}>March 2023</p>
                  </div>
                </div>
              </div>

              <div className="slide">
                <div className="ratings">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>

                <p style={{ fontSize: '16px', height: '120px' }}>
                  “Very professional, kind, warm and knowledgeable doctor. Highly recommend”
                </p>

                <div className="rater">
                  <div className="circle flex" style={{ width: '50px', height: '50px' }}>
                    <i className="fa-solid fa-j"></i>
                  </div>
                  <div className="raterDetail">
                    <h4>Justyna</h4>
                    <p style={{ fontSize: '12px', width: '100px' }}>December 2022</p>
                  </div>
                </div>
              </div>

              <div className="slide">
                <div className="ratings">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>

                <p style={{ fontSize: '16px', height: '120px' }}>
                  “The doctor was very helpful and gave me some great advice. I’d be happy to use her again.”
                </p>

                <div className="rater">
                  <div className="circle flex" style={{ width: '50px', height: '50px' }}>
                    <i className="fa-solid fa-m"></i>
                  </div>
                  <div className="raterDetail">
                    <h4>Mimi</h4>
                    <p style={{ fontSize: '12px', width: '100px' }}>February 2023</p>
                  </div>
                </div>
              </div>

              <div className="slide">
                <div className="ratings">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>

                <p style={{ fontSize: '16px', height: '120px' }}>
                  “I lost the connection, but the appointment went well. Will be baiting for a medicine name. Please,
                  could you Send it via my email? Kind regards, Iry...”
                </p>

                <div className="rater">
                  <div className="circle flex" style={{ width: '50px', height: '50px' }}>
                    <i className="fa-solid fa-i"></i>
                  </div>
                  <div className="raterDetail">
                    <h4>Iryna</h4>
                    <p style={{ fontSize: '12px', width: '100px' }}>January 2023</p>
                  </div>
                </div>
              </div>

              <div className="slide">
                <div className="ratings">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>

                <p style={{ fontSize: '16px', height: '120px' }}>
                  “Would highly recommend Joanna, she was very patient and listened and assessed our little French
                  bulldog. Would definitely recommend for peace of min...”
                </p>

                <div className="rater">
                  <div className="circle flex" style={{ width: '50px', height: '50px' }}>
                    <i className="fa-solid fa-n"></i>
                  </div>
                  <div className="raterDetail">
                    <h4>Noreen</h4>
                    <p style={{ fontSize: '12px', width: '100px' }}>December 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pet connection section */}
      <div className="pet-connection">
        <h1>Pet Connection</h1>
        <div className="pet-connection-innerDiv">
          <p>
            Explore our curated collection of pet telehealth & news, articles and blog posts. <span>More pet resources
              →</span>{' '}
          </p>
        </div>

        <div className="grid">
          <div className="grid-card">
            <img src="https://images.vetster.com/grey_cat_being_petted_fb599118c3.jpg" alt="" />
            <div>
              <span>WELLNESS</span>
              <h3>Preventative wellness tips for your cat</h3>
              <p>
                There are many ways you can improve your cat’s physical and mental state. Annual veterinary exams,
                staying up to date on vaccines,
              </p>

              <a href="#">Learn more →</a>
            </div>
          </div>
          <div className="grid-card">
            <img src="https://images.vetster.com/puppy_eating_from_bowl_0db6a6081d.jpg" alt="" />
            <div>
              <span>BLOG</span>
              <h3>Preventative wellness tips for your cat</h3>
              <p>
                There are many ways you can improve your cat’s physical and mental state. Annual veterinary exams,
                staying up to date on vaccines,
              </p>
              <a href="#">Learn more →</a>
            </div>
          </div>
          <div className="grid-card">
            <img
              src="https://images.vetster.com/General_Advice_and_Guidance_in_Virtual_Care_USA_CAN_3a5476d52e.jpg"
              alt=""
            />
            <div>
              <span>WELLNESS</span>
              <h3>Preventative wellness tips for your cat</h3>
              <p>
                There are many ways you can improve your cat’s physical and mental state. Annual veterinary exams,
                staying up to date on vaccines,
              </p>
              <a href="#">Learn more →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer start */}
      <div id="footer"></div>
    </div>
  );
};

export default HomePage;