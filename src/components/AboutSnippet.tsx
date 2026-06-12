
export default function AboutSnippet() {
  return (
    <>
{/* ABOUT SNIPPET */}
  <section className="section" style={{"background":"radial-gradient(circle at 10% 20%, rgba(249, 115, 22, 0.03) 0%, rgba(255, 255, 255, 1) 90%)","borderBottom":"1px solid var(--gray-100)"}}>
    <div className="wrap split" style={{"alignItems":"flex-start","gap":"80px"}}>
      <div>
        <span className="chip" style={{"background":"var(--orange-light)","color":"var(--orange)","border":"none","marginBottom":"8px"}}>Something</span>
        <h2 className="section-title" style={{"textAlign":"left","fontSize":"46px","lineHeight":"1.1","fontWeight":"800","letterSpacing":"-1.5px","marginBottom":"0"}}>About Us</h2>
      </div>
      <div style={{"display":"flex","flexDirection":"column","gap":"16px"}}>
        <p style={{"fontSize":"15px","color":"var(--gray-600)","lineHeight":"1.8","marginBottom":"0"}}>
          We provide premium quality IT services to our clients through the latest technologies at an affordable cost.
        </p>
        <p style={{"fontSize":"15px","color":"var(--gray-600)","lineHeight":"1.8","marginBottom":"0"}}>
          Our goal is to dynamically grow your business, starting from the ground up or assisting in an already operating scenario.
        </p>
        
        {/* Premium callout card for the angry-less birds hook */}
        <div className="about-highlight-card" style={{"background":"rgba(249, 115, 22, 0.05)","border":"1.5px dashed rgba(249, 115, 22, 0.25)","borderRadius":"14px","padding":"20px 22px","display":"flex","gap":"16px","alignItems":"flex-start","marginTop":"12px","transition":"var(--transition)","cursor":"default"}}>
          <div style={{"width":"38px","height":"38px","background":"var(--orange-light)","borderRadius":"50%","display":"flex","alignItems":"center","justifyContent":"center","flexShrink":"0","fontSize":"18px"}}>🐦</div>
          <div>
            <h4 style={{"fontFamily":"'Syne', sans-serif","fontSize":"15px","fontWeight":"700","color":"var(--black)","marginBottom":"4px"}}>We are "angry-less birds"!</h4>
            <p style={{"fontSize":"13.5px","color":"var(--gray-600)","lineHeight":"1.6","marginBottom":"0"}}>We stay cool, collected, and friendly in every situation to answer your queries and provide the absolute best service.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
    </>
  );
}
