"""
    Utils module
"""
from flask import url_for


class APIException(Exception):
    """ APIException class """
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        """Return format Dict"""
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


def has_no_empty_params(rule):
    """Check params not empty"""
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)


def generate_sitemap(app):
    """View by default"""
    links = []
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            links.append(url)
    links_html = "".join([
        "<li><a href='" + y + "'>" + y + "</a></li>" for y in links
        ])
    return """
        <div style="text-align: center;">
            <div style="margin-top:3rem;"><div/>
            <h1>SWAPP ENDPOINTS</h1>
            <br/>
            <br/>
            <ul style="text-align: left;">
                """ + links_html + """
            </ul>
        </div>
        """
