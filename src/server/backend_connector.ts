const PRJ = "magnetic-runway-428121";


export async function get_form_data() {
    const baseUrl = "https://backend-v1-1010920399604.northamerica-northeast2.run.app";
    const idToken = await googleAuth();

    const response = await fetch(`${baseUrl}/internal/form_data`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        }
    });
    return await response.json();
}


async function googleAuth() {
    // Base API configuration
    const baseUrl = "https://backend-v1-1010920399604.northamerica-northeast2.run.app";
     
    let idToken;
    try {
      console.log("Attempting to get identity token...");
      
      const response = await fetch("http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=" + baseUrl, {
        headers: {
          "Metadata-Flavor": "Google"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get identity token: ${response.status} ${response.statusText}`);
      }
      
      idToken = await response.text();
      console.log("Token received successfully");
    } catch (error: any) {
      console.error("MS Connection failed. Full error:", error);
      console.error("Error message:", error.message);
      if (error.cause) console.error("Parent error:", error.cause);
      throw error;
    }
    return idToken;
  }