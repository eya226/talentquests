import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the login page
        page.goto("http://localhost:5173/login")
        expect(page).to_have_title(re.compile("TalentQuest"))
        page.screenshot(path="jules-scratch/verification/01_login_page.png")

        # Fill in the email and password
        page.get_by_placeholder("Enter your email").fill("test.user@talentquest.com")

        # Click the login button
        page.get_by_role("button", name="Log In with Email").click()

        # Wait for navigation to the dashboard and take a screenshot
        expect(page).to_have_url(re.compile(r".*/$"))
        expect(page.get_by_role("heading", name=re.compile("Welcome"))).to_be_visible()
        page.screenshot(path="jules-scratch/verification/02_dashboard_view.png")

        # Navigate to the profile page
        page.get_by_role("link", name="Profile").click()

        # Wait for the profile page to load and take a screenshot
        expect(page).to_have_url(re.compile(r".*/profile$"))
        expect(page.get_by_role("heading", name="Your Profile")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/03_profile_view.png")

    except Exception as e:
        print(f"An error occurred during Playwright verification: {e}")
        # Take a screenshot on error to help debug
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        # Clean up
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)