import re
from playwright.sync_api import sync_playwright, Page, expect

def on_console(msg):
    print(f"Browser Console: [{msg.type}] {msg.text}")

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for console messages
    page.on("console", on_console)

    try:
        # Navigate to the login page
        page.goto("http://localhost:5173/login")

        # Fill in the email and password using the data-testid
        page.get_by_test_id("email-input").fill("test.user@talentquest.com")

        # Click the login button
        page.get_by_role("button", name="Log In with Email").click()

        # Wait for navigation to the dashboard and take a screenshot
        expect(page).to_have_url(re.compile(r".*/$"))
        expect(page.get_by_role("heading", name="Welcome, test.user@talentquest.com!")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/01_dashboard_view.png")

        # Navigate to the profile page
        page.get_by_role("link", name="Profile").click()

        # Wait for the profile page to load and take a screenshot
        expect(page).to_have_url(re.compile(r".*/profile$"))
        expect(page.get_by_role("heading", name="Your Profile")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/02_profile_view.png")

    finally:
        # Clean up
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)