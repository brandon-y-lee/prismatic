from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
import os

app = Flask(__name__)

@app.route('/scrape', methods=['POST'])
def scrape_zimas():
  data = request.json
  house_number = data['house_number']
  street_name = data['street_name']

  chrome_options = webdriver.ChromeOptions()
  chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
  chrome_options.add_argument("--headless")
  chrome_options.add_argument("--disable-dev-shm-usage")
  chrome_options.add_argument("--no-sandbox")

  chrome_service = Service(executable_path=os.environ.get("CHROMEDRIVER_PATH"))
  driver = webdriver.Chrome(service=chrome_service, options=chrome_options)

  try:
    driver.get("https://zimas.lacity.org/")
    wait = WebDriverWait(driver, 10)

    # Accept Terms and Conditions
    try:
      accept_button = wait.until(EC.element_to_be_clickable((By.ID, "btn")))
      accept_button.click()
    except Exception as e:
      print("No Accept Button found or error clicking it:", e)

    # Input the house number
    house_number_input = wait.until(EC.visibility_of_element_located((By.ID, "txtHouseNumber")))
    house_number_input.clear()
    house_number_input.send_keys(house_number)

    # Input the street name
    street_name_input = driver.find_element(By.ID, "txtStreetName")
    street_name_input.clear()
    street_name_input.send_keys(street_name)

    # Click the search button
    search_button = driver.find_element(By.ID, "btnSearchGo")
    search_button.click()

    # Wait for the search results to load
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "div.divTabClearDataTarget")))

    scraped_data = {}

    # Toggle each section open before scraping
    data_tabs_links = driver.find_elements(By.CSS_SELECTOR, "td.DataTabs > a.aClearDataTarget")[1:]
    for link in data_tabs_links:
      try:
        # Use JavaScript to click on the element to ensure visibility is not an issue
        driver.execute_script("arguments[0].click();", link)
      except Exception as e:
        print("Error toggling section via link:", e)

    tables = driver.find_elements(By.CSS_SELECTOR, "div.divTabClearDataTarget table")
    skip_section = False
    for table in tables:
      rows = table.find_elements(By.TAG_NAME, "tr")
      for row in rows:
        columns = row.find_elements(By.TAG_NAME, "td")

        if len(columns) == 2:
          key = columns[0].text.strip()
          value_element = columns[1]
          link = value_element.find_elements(By.TAG_NAME, "a")
          if link:
            value = link[0].text.strip()
          else:
            value = value_element.text.strip()

          if key and value:
            scraped_data[key] = value

  except Exception as e:
    print(f"An error occurred: {e}")
    scraped_data = {"error": "Failed to complete the scraping process."}
  
  finally:
      driver.quit()

  return jsonify(scraped_data), 200 if "error" not in scraped_data else 500

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
