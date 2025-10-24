import time
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    unique_email = f"testuser_{int(time.time())}@example.com"
    password = "password"

    # --- Sign Up and Login ---
    page.goto("http://localhost:5173/login")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/01_login_page.png")

    page.get_by_role("button", name="Continue with Email").click()
    page.get_by_placeholder("Enter your email").fill(unique_email)
    page.get_by_placeholder("Enter your password").fill(password)
    page.get_by_role("button", name="Sign Up").click()

    # Give the signup time to process
    page.wait_for_timeout(1000)

    page.get_by_role("button", name="Sign In").click()

    # Onboarding Page
    page.wait_for_url("**/onboarding")
    page.screenshot(path="jules-scratch/verification/02_onboarding_page.png")

    page.get_by_role("button", name="Start Talking").click()

    # Answer onboarding questions
    questions = [
      "Project X",
      "Check the logs",
      "With others",
      "A startup"
    ]

    for question in questions:
        page.get_by_placeholder("Say something...").fill(question)
        page.get_by_role("button", name="➤").click()
        page.wait_for_timeout(500)

    # Dashboard Page
    page.wait_for_url("**/dashboard")
    page.screenshot(path="jules-scratch/verification/03_dashboard_page.png")

    # Profile Page
    page.goto("http://localhost:5173/profile")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/04_profile_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
