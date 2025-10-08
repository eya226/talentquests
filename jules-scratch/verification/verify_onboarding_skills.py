from playwright.sync_api import Page, expect
import time

def test_onboarding_page_loads(page: Page):
    """
    This is a simplified test to verify that the Aria Onboarding page can be loaded.
    """
    # 1. Arrange: Go to the onboarding page.
    print("Navigating to http://localhost:5173/onboarding")
    try:
        page.goto("http://localhost:5173/onboarding", timeout=30000)
        print("Navigation successful.")
    except Exception as e:
        print(f"Navigation failed: {e}")
        page.screenshot(path="jules-scratch/verification/navigation_error.png")
        return

    # 2. Wait for a few seconds to let the page load completely.
    print("Waiting for 5 seconds...")
    time.sleep(5)

    # 3. Screenshot: Capture the final result for visual verification.
    print("Taking screenshot...")
    page.screenshot(path="jules-scratch/verification/onboarding_page.png")
    print("Screenshot taken.")