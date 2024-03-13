from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import sys
import time
import json

def scrape_zimas(house_number, street_name):
  chrome_options = Options()
  chrome_options.add_argument("--headless")
  chrome_options.add_argument("--disable-gpu")
  chrome_options.add_argument("--no-sandbox")
  chrome_options.add_argument("--disable-dev-shm-usage")
  driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

  # Navigate to the ZIMAS website
  driver.get("https://zimas.lacity.org/")
  # Wait for the dialog to appear
  time.sleep(2)

  # Accept Terms and Conditions
  try:
    accept_button = driver.find_element(By.ID, "btn")
    if accept_button:
      accept_button.click()
    time.sleep(1)  # Wait for the page to react
  except Exception as e:
    print("No Accept Button found or error clicking it:", e)

  # Input the house number
  house_number_input = driver.find_element(By.ID, "txtHouseNumber")
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
  time.sleep(1)

  # Initialize an empty list to store data from each row
  scraped_data = {}

  # Toggle each section open before scraping
  data_tabs_links = driver.find_elements(By.CSS_SELECTOR, "td.DataTabs > a.aClearDataTarget")[1:]
  for link in data_tabs_links:
    try:
      # Use JavaScript to click on the element to ensure visibility is not an issue
      driver.execute_script("arguments[0].click();", link)
      time.sleep(0.5)
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

  print(json.dumps(scraped_data))
  
  driver.quit()


if __name__ == "__main__":
  house_number = sys.argv[1]
  street_name = sys.argv[2]
  scrape_zimas(house_number, street_name)