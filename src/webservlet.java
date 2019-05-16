
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Servlet implementation class webservlet
 */
@WebServlet("/webservlet")
public class webservlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public webservlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		File file = new File("C:\\Users\\LDG\\Desktop\\LRDL\\LRDL.geojson");

		String content = FileUtils.readFileToString(file, "UTF-8");

		byte[] b = content.getBytes();
		System.out.println(b.length);

		// jsonObj.element("a", "123");
		// jsonObj.element("b", "132");
		// System.out.print(content);
		response.setContentType("application/json; charset=utf-8");
		PrintWriter pw = response.getWriter();
		pw.print(content);
		pw.flush();
		pw.close();
	}

}
