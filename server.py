import os
import sys
import json
import urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

# Add current folder to path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CURRENT_DIR)

from toyota_client import ToyotaBeyondClient

# Global client singleton
client = ToyotaBeyondClient()

class WACRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        static_dir = os.path.join(CURRENT_DIR, "static")
        super().__init__(*args, directory=static_dir, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def _send_json(self, data, status_code=200):
        try:
            body = json.dumps(data, ensure_ascii=False).encode("utf-8")
            self.send_response(status_code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            self.wfile.write(body)
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            pass

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # API Routes
        if path == "/api/status":
            try:
                status = client.get_status()
                self._send_json({"success": True, "data": status})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path == "/api/wac/list":
            try:
                page = int(query.get("page", ["0"])[0])
                page_size = min(max(1, int(query.get("pageSize", ["10"])[0])), 10)
                status = query.get("status", [None])[0]
                if status in ["ALL", "Semua", "SEMUA", "all"]:
                    status = None
                is_need_bp = query.get("isNeedBP", [None])[0]
                search = query.get("search", [None])[0]
                force = query.get("refresh", ["0"])[0] in ["1", "true"]

                res = client.get_wac_list(page=page, page_size=page_size, status=status, search=search, is_need_bp=is_need_bp, force_refresh=force)
                self._send_json({"success": True, "data": res.get("data", {}), "message": res.get("message")})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path == "/api/wac/damage-list":
            try:
                data = client.get_damage_list()
                self._send_json({"success": True, "data": data.get("data", {})})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path == "/api/wac/annotation/list":
            try:
                wac_id = query.get("WACID", [""])[0]
                data = client.get_annotation_list(wac_id)
                self._send_json({"success": True, "data": data.get("data", {})})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path == "/api/wac/additional-jobs":
            try:
                category = query.get("category", ["CAR_CARE_BP,CAR_CARE"])[0]
                search = query.get("search", [None])[0]
                vin = query.get("vin", [None])[0]
                data = client.get_additional_jobs(category=category, search=search, vin=vin)
                self._send_json({"success": True, "data": data})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path.startswith("/api/wac/detail/"):
            wac_id = path.replace("/api/wac/detail/", "").strip()
            force = query.get("refresh", ["0"])[0] in ["1", "true"]
            try:
                data = client.get_wac_full(wac_id, force_refresh=force)
                self._send_json({"success": True, "data": data})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        # Default static file handling
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length > 0 else b"{}"
        try:
            payload = json.loads(body.decode("utf-8")) if body else {}
        except Exception:
            payload = {}

        if path.startswith("/api/wac/autofill/"):
            wac_id = path.replace("/api/wac/autofill/", "").strip()
            try:
                res = client.generate_auto_fill_payload(wac_id, payload.get("options"))
                self._send_json({"success": True, "data": res})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path.startswith("/api/wac/annotation/update/"):
            wac_id = path.replace("/api/wac/annotation/update/", "").strip()
            try:
                items = payload.get("items", [])
                res = client.update_annotation(wac_id, items)
                self._send_json({"success": True, "data": res})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path.startswith("/api/wac/annotation/delete/"):
            wac_id = path.replace("/api/wac/annotation/delete/", "").strip()
            try:
                point = payload.get("annotationPoint") or int(payload.get("point", 1))
                res = client.delete_annotation(wac_id, point)
                self._send_json({"success": True, "data": res})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path.startswith("/api/wac/save-draft/"):
            wac_id = path.replace("/api/wac/save-draft/", "").strip()
            try:
                chk = payload.get("checklist") or {}
                rec = payload.get("recommendation") or {}
                det = payload.get("detail") or {}

                # Map detail fields into checklist payload as required by TAM APIM
                if "mileage" in det:
                    chk["mileage"] = det["mileage"]
                if "carrierName" in det:
                    chk["carrierName"] = det["carrierName"]
                if "carrierPhoneNumber" in det:
                    chk["carrierPhoneNumber"] = det["carrierPhoneNumber"]
                if "isCarrierEqualMaster" in det:
                    chk["isCarrierEqualMaster"] = det["isCarrierEqualMaster"]

                res = client.save_draft(wac_id, chk, rec)
                self._send_json({"success": True, "data": res})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path.startswith("/api/wac/finalize/"):
            wac_id = path.replace("/api/wac/finalize/", "").strip()
            try:
                chk = payload.get("checklist") or {}
                rec = payload.get("recommendation") or {}
                det = payload.get("detail") or {}

                if "mileage" in det:
                    chk["mileage"] = det["mileage"]
                if "carrierName" in det:
                    chk["carrierName"] = det["carrierName"]
                if "carrierPhoneNumber" in det:
                    chk["carrierPhoneNumber"] = det["carrierPhoneNumber"]
                if "isCarrierEqualMaster" in det:
                    chk["isCarrierEqualMaster"] = det["isCarrierEqualMaster"]

                cust_sig = payload.get("customerSignature")
                sa_sig = payload.get("saSignature")
                is_offline = payload.get("isOffline", True)

                res = client.finalize_wac(
                    wac_id=wac_id,
                    checklist_payload=chk,
                    recs_payload=rec,
                    customer_sig_b64=cust_sig,
                    sa_sig_b64=sa_sig,
                    is_offline=is_offline
                )
                self._send_json({"success": True, "data": res})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        self._send_json({"error": "Endpoint not found"}, 404)

        self._send_json({"error": "Endpoint not found"}, 404)

class WACServer(ThreadingHTTPServer):
    allow_reuse_address = True

def run_server(port=5050):
    server_address = ("127.0.0.1", port)
    try:
        httpd = WACServer(server_address, WACRequestHandler)
    except OSError as e:
        # WinError 10048: Only one usage of each socket address is normally permitted
        print(f"ℹ️ Port {port} sudah aktif berjalan.")
        return

    print(f"============================================================")
    print(f"🚀 Toyota Beyond WAC GR Engine berjalan pada: http://localhost:{port}")
    print(f"🟢 Terhubung secara langsung ke Beyond Toyota Astra APIM")
    print(f"============================================================")
    # Prewarm cache in background so first browser request loads in milliseconds
    client.start_prewarm()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == "__main__":
    port = 5050
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port)

