import { PulseFitHero } from "@/components/ui/pulse-fit-hero";

export default function PulseFitHeroDemo() {
  return (
    <PulseFitHero
      logo="PulseFit"
      navigation={[
        { label: "Features", onClick: () => console.log("Features") },
        { label: "Programs", hasDropdown: true, onClick: () => console.log("Programs") },
        { label: "Testimonials", onClick: () => console.log("Testimonials") },
        { label: "Pricing", onClick: () => console.log("Pricing") },
        { label: "Contact", onClick: () => console.log("Contact") },
      ]}
      ctaButton={{
        label: "Get Free Trial",
        onClick: () => console.log("Get Free Trial"),
      }}
      title="Train smarter. Anywhere. Anytime."
      subtitle="Guided fitness sessions tailored to your goals - whether it's strength, endurance, or flexibility. Streamlined, motivating, and accessible 24/7."
      primaryAction={{
        label: "Start training",
        onClick: () => console.log("Start training"),
      }}
      secondaryAction={{
        label: "Browse programs",
        onClick: () => console.log("Browse programs"),
      }}
      disclaimer="*No credit card required"
      socialProof={{
        avatars: [
          "https://cdn.21st.dev/assets/mirror/f0/f02fed36023656a5b5df6f247c83c96c53bfa9db5b98085cdee93ffc938a5f37.jpg",
          "https://cdn.21st.dev/assets/mirror/5b/5b5b2f3487692d40f629010ea6448d150907f780d8c262c4ca194b7386115c2d.jpg",
          "https://cdn.21st.dev/assets/mirror/10/10e2bfa5446e5c116e269b649b5f5e0106d96643f0a903048f3a056e40c35cd8.jpg",
          "https://cdn.21st.dev/assets/mirror/fa/fae47bb0faba45d1e0696b6557ca36c551a738c7d6e3950e82bb69dd2f963a72.jpg",
        ],
        text: "Join over 10,000+ people",
      }}
      programs={[
        {
          image: "https://cdn.21st.dev/assets/mirror/4b/4bce7fdac66e89582bda440c7addd609e0a9a02fb4c1d8fb9553c73d0b43ab41.jpg",
          category: "BEGINNER",
          title: "Jumping challenge",
          onClick: () => console.log("Jumping challenge"),
        },
        {
          image: "https://cdn.21st.dev/assets/mirror/ca/cadcf059bfbef20421dbbf5dd6841fc51029a434f131f1076f88cfcbef8e49b0.jpg",
          category: "INTERMEDIATE",
          title: "Core stability flow",
          onClick: () => console.log("Core stability flow"),
        },
        {
          image: "https://cdn.21st.dev/assets/mirror/9d/9db96f9491c478fad5f783a184c2e8681abe0c0e07c5c0d3c8104919a289e6f7.jpg",
          category: "ADVANCED",
          title: "Trail sprint challenge",
          onClick: () => console.log("Trail sprint challenge"),
        },
        {
          image: "https://cdn.21st.dev/assets/mirror/ae/ae2d78b3ff54a89f7fdcb8c5c1e9f3cc5e0be99570a816af8a7735e9228badff.jpg",
          category: "ALL LEVELS",
          title: "Full-body bootcamp",
          onClick: () => console.log("Full-body bootcamp"),
        },
        {
          image: "https://cdn.21st.dev/assets/mirror/c8/c8c8636ca3521e0b5b883a68d7da589a54be66b739564c08c3a97c2d27fa1322.jpg",
          category: "RECOVERY",
          title: "Mobility & Recovery",
          onClick: () => console.log("Mobility & Recovery"),
        },
      ]}
    />
  );
}
