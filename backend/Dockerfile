FROM python:3.12.0

WORKDIR /backend/

COPY . /backend/

RUN pip install hatch uv

ENV PATH="backend/.venv/bin:$PATH"

RUN uv venv

RUN hatch run uv sync

EXPOSE 8000

CMD ["hatch", "run", "start"]
