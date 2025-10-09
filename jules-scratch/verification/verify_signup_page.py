from playwright.sync_api import Page, expect

def test_signup_page_has_role_selector(page: Page):
    """
    This test verifies that the Sign Up page now includes
    a role selector for 'Student' or 'Recruiter'.
    """
    # 1. Arrange: Go to the signup page.
    page.goto("http://localhost:5173/signup")

    # 2. Assert: Check that the new role selector is visible.
    expect(page.get_by_label("I am a:")).to_be_visible()

    # 3. Assert: Check for the options in the dropdown.
    expect(page.get_by_role("option", name="Student")).to_be_visible()
    expect(page.get_by_role("option", name="Recruiter")).to_be_visible()

    # 4. Screenshot: Capture the result for visual verification.
    page.screenshot(path="jules-scratch/verification/signup_page.png")