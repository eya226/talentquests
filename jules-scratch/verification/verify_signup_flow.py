import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the sign-up page
        print("Navigating to the sign-up page...")
        page.goto("http://localhost:5173/signup")

        # Check for the main heading to ensure the page has loaded
        expect(page.get_by_role("heading", name="Create Your Account")).to_be_visible()

        print("Sign-up page loaded successfully. Taking screenshot...")
        page.screenshot(path="jules-scratch/verification/01_signup_page.png")

    except Exception as e:
        print(f"An error occurred during Playwright verification: {e}")
        # Take a screenshot on error to help debug
        print("Taking error screenshot...")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        # Clean up
        print("Closing browser.")
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)