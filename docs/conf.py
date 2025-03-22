# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'triage.ai'
copyright = '2025, triage.ai'
author = 'Shivam Patel'
release = '1.0.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ['sphinx_toolbox.sidebar_links', 'sphinx_toolbox.github', 'sphinx_new_tab_link']
github_username = 'triage-ai'
github_repository = 'triage'
templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']



# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
html_logo = '_static/logo.svg'
html_theme_options = {
    'logo_only': True,
    'display_version': False
}

html_context = {
  'display_github': True,
  'github_user': 'shivamrpatel',
  'github_repo': 'docs',
  'github_version': 'master/',
}

