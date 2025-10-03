from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:5173/login", wait_until="networkidle")
        page.screenshot(path="jules-scratch/verification/login_page_debug.png")
        print("Screenshot taken of the login page.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)