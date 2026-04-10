"use client"

/**
 * Allows any user (logged in or anonymous) to report another user for violating community guidelines.
 * @param props - None
 */
export default function ReportUser() {

  /**
   * Handles form submission by collecting form data and sending it to the report API.
   * @param e - The form submission event
   */
  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const user = localStorage.getItem("user");

    // If user is logged in, use their username as reporter, otherwise mark as "Anonymous"
    const reporter = user ? JSON.parse(user).username : "Anonymous";

    // Collects all form data, including multiple violation types
    const object = {
      ...Object.fromEntries(formData.entries()),
      violation_types: formData.getAll("violation_type"),
      reporter: reporter,
    };

    // Send the collected form data as JSON to the support report endpoint
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/report/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });
      if (!res.ok) throw new Error("Failed to submit");
      alert("Report submitted successfully!");

      // Reset the form after successful submission
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to submit report. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm border" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold mb-6 text-center">Report Content</h1>

        {/* Subject of the report */}
        <div>
          <label className="block mb-2 text-base font-medium text-gray-500">Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="Subject of your report"
            minLength={10}
            maxLength={100}
            className="w-full rounded-md border px-4 py-2"
            required
          />
        </div>

        {/* Username of the user being reported */}
        <div>
          <label className="block mb-2 text-base font-medium text-gray-500">Report User</label>
          <input
            type="text"
            name="reported_user"
            placeholder="Username of the user you want to report"
            minLength={6}
            maxLength={30}
            className="w-full rounded-md border px-4 py-2"
            required
          />
        </div>

        {/* Direct link to the offending content */}
        <div>
          <label className="block mb-2 text-base font-medium text-gray-500">Link to Content</label>
          <input
            type="url"
            name="content_link"
            placeholder="https://..."
            className="w-full rounded-md border px-4 py-2"
            required
          />
        </div>

        {/* Optional date of when the incident occurred */}
        <div>
          <label className="block mb-2 text-base font-medium text-gray-500">Date of Incident</label>
          <input
            type="date"
            name="incident_date"
            className="w-full rounded-md border px-4 py-2"
          />
        </div>

        {/* Checkboxes for violation categories */}
        <div>
          <label className="block mb-2 text-base font-medium text-gray-500">Type of Violation</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="age" name="violation_type" value="age" className="w-4 h-4 rounded" />
            <label htmlFor="age" className="text-sm font-medium">Age-Inappropriate Content</label>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="spam" name="violation_type" value="spam" className="w-4 h-4 rounded" />
            <label htmlFor="spam" className="text-sm font-medium">Spam or Irrelevant Content</label>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="harassment" name="violation_type" value="harassment" className="w-4 h-4 rounded" />
            <label htmlFor="harassment" className="text-sm font-medium">Harassment or Hate</label>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="media" name="violation_type" value="media" className="w-4 h-4 rounded" />
            <label htmlFor="media" className="text-sm font-medium">Media Violation</label>
          </div>
        </div>

        {/* Text box for describing the issue */}
        <div>
          <label className="block mb-2 text-base font-medium text-gray-500">Describe the Issue</label>
          <textarea
            name="description"
            placeholder="Describe the issue..."
            minLength={40}
            maxLength={1000}
            className="w-full rounded-md border px-4 py-2 h-32"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 transition"
        >
          Submit Report
        </button>

      </form>
    </div>
  );
}
