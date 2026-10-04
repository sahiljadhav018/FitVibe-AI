import { PulseFitHero } from "@/components/ui/pulse-fit-hero";

export default function PulseFitHeroDemo() {
  return (
    <PulseFitHero
      logo="FitVerse AI"
      navigation={[
        { label: "Rahul's Day Demo", onClick: () => console.log("Rahul Demo") },
        { label: "Smart Score AI", hasDropdown: true, onClick: () => console.log("Smart Score") },
        { label: "MicroFit Engine", onClick: () => console.log("MicroFit") },
        { label: "Campus Twin", onClick: () => console.log("Campus Twin") },
        { label: "Anti-Dropout", onClick: () => console.log("Anti-Dropout") },
      ]}
      ctaButton={{
        label: "Launch SIH Walkthrough",
        onClick: () => console.log("Launch SIH Walkthrough"),
      }}
      title="Fitness inside Rahul's real day. Not another gym app."
      subtitle="We don't ask students to find 1 hour for the gym. FitVerse turns campus transit, lecture breaks, and dorm life into active vitality — 0% gym equipment required."
      primaryAction={{
        label: "Start 60s Judge Demo",
        onClick: () => console.log("Start 60s Judge Demo"),
      }}
      secondaryAction={{
        label: "Compare Smart Score",
        onClick: () => console.log("Compare Smart Score"),
      }}
      disclaimer="*SIH 2026 Innovation PS #26196 • Zero wearable hardware required"
      socialProof={{
        avatars: [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
        ],
        text: "Empowering 10,000+ sedentary college students",
      }}
      programs={[
        {
          image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
          category: "09:00 AM • TRANSIT",
          title: "300m Campus Walk Challenge",
          onClick: () => console.log("09:00 AM Transit"),
        },
        {
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
          category: "11:30 AM • POST-LECTURE",
          title: "3-Min Desk Thoracic Reset",
          onClick: () => console.log("11:30 AM Post-Lecture"),
        },
        {
          image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
          category: "01:00 PM • CANTEEN RUSH",
          title: "3-Flight Stair Mission",
          onClick: () => console.log("01:00 PM Canteen"),
        },
        {
          image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
          category: "04:30 PM • PEER SYNC",
          title: "Anti-Dropout Walk Match",
          onClick: () => console.log("04:30 PM Peer Sync"),
        },
        {
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
          category: "06:00 PM • WIND-DOWN",
          title: "8-Min Dorm Room Calisthenics",
          onClick: () => console.log("06:00 PM Dorm Burn"),
        },
      ]}
    />
  );
}
