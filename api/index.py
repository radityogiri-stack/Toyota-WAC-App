import os
import sys
import json
import urllib.parse
from http.server import BaseHTTPRequestHandler

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, CURRENT_DIR)
sys.path.insert(0, PARENT_DIR)

from toyota_client import ToyotaBeyondClient

# Singleton client instance
client = ToyotaBeyondClient()

class handler(BaseHTTPRequestHandler):
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
            wac_id = path.replace("/api/wac/detail/", "").split("?")[0].strip()
            force = query.get("refresh", ["0"])[0] in ["1", "true"]
            try:
                data = client.get_wac_full(wac_id, force_refresh=force)
                self._send_json({"success": True, "data": data})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        self._send_json({"error": "Endpoint not found"}, 404)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_length) if content_length > 0 else b"{}"

        try:
            payload = json.loads(raw_body.decode("utf-8")) if raw_body else {}
        except Exception:
            payload = {}

        if path.startswith("/api/wac/autofill/"):
            wac_id = path.replace("/api/wac/autofill/", "").split("?")[0].strip()
            try:
                res = client.generate_auto_fill_payload(wac_id, payload.get("options"))
                self._send_json({"success": True, "data": res})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path.startswith("/api/wac/annotation/update/"):
            wac_id = path.replace("/api/wac/annotation/update/", "").split("?")[0].strip()
            try:
                items = payload.get("items", [])
                res = client.update_annotation(wac_id, items)
                self._send_json({"success": True, "data": res})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path.startswith("/api/wac/annotation/delete/"):
            wac_id = path.replace("/api/wac/annotation/delete/", "").split("?")[0].strip()
            try:
                point = payload.get("annotationPoint") or int(payload.get("point", 1))
                res = client.delete_annotation(wac_id, point)
                self._send_json({"success": True, "data": res})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path.startswith("/api/wac/save-draft/"):
            wac_id = path.replace("/api/wac/save-draft/", "").split("?")[0].strip()
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

                res = client.save_draft(wac_id, chk, rec)
                self._send_json({"success": True, "data": res})
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return

        elif path.startswith("/api/wac/finalize/"):
            wac_id = path.replace("/api/wac/finalize/", "").split("?")[0].strip()
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
